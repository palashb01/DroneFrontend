import React, { useEffect } from 'react'
import { Chart, registerables } from 'chart.js';

const Accelerometer = () => {

  useEffect(() => {

    let lineChart;
    const DATA_COUNT = 50;
    const frequency = 10;

    if (typeof window !== 'undefined') {
      // draw chart
      Chart.register(...registerables);
      const ctx = document.getElementById('myChart').getContext('2d');

      const labels = [];
      for (let i = 0; i <= DATA_COUNT; ++i) {
        labels.push(i.toString());
      }
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Acceleration X',
            data: [],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545aa',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: 'Acceleration Y',
            data: [],
            borderColor: '#28a745',
            backgroundColor: '#28a745aa',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: 'Acceleration Z',
            data: [],
            borderColor: '#007bff',
            backgroundColor: '#007bffaa',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        ]
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: false,
          plugins: {
            title: {
              display: true,
              text: 'Linear Acceleration Sensor'
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: false,
              title: {
                display: false,
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Value'
              },
              suggestedMin: -10,
              suggestedMax: 10
            }
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
        data
      };
      lineChart = new Chart(ctx, config);

      // // For debugging on PC if sensor is not available
      // let counter = 0;
      // setInterval(() => {
      //   // order matters
      //   // first splice -> then push
      //   if (counter > DATA_COUNT) {
      //     lineChart.data.labels.splice(0, 1);
      //     lineChart.data.labels.push(counter.toString());
      //     lineChart.data.datasets[0].data.splice(0, 1);
      //   }

      //   lineChart.data.datasets[0].data.push(Math.random() * 2 - 1);
      //   counter++;
      //   lineChart.update();
      // }, 100);
    }

    let accelerometer = null;
    try {
      accelerometer = new LinearAccelerationSensor({ frequency });
      accelerometer.onerror = (event) => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
          alert('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError') {
          alert('Cannot connect to the sensor.');
        }
      };

      let counter = 0;
      accelerometer.onreading = (e) => {
        
        if (counter > DATA_COUNT) {
          lineChart.data.labels.splice(0, 1);
          lineChart.data.labels.push(counter.toString());
          lineChart.data.datasets[0].data.splice(0, 1);
          lineChart.data.datasets[1].data.splice(0, 1);
          lineChart.data.datasets[2].data.splice(0, 1);
        }
        lineChart.data.datasets[0].data.push(accelerometer.x);
        lineChart.data.datasets[1].data.push(accelerometer.y);
        lineChart.data.datasets[2].data.push(accelerometer.z);

        counter++;
        lineChart.update();

      };
      accelerometer.start();
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        alert('Sensor construction was blocked by the Permissions Policy.');
      } else if (error.name === 'ReferenceError') {
        alert('Sensor is not supported by the User Agent.');
      } else {
        throw error;
      }
    }
  }, [])

  return (
    <div>
      <canvas id="myChart" width={350} height={350}></canvas>
    </div>
  )
}

export default Accelerometer