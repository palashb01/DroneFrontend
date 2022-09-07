export function checkMediaSupport(callback) {
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
    navigator.enumerateDevices = function (callback) {
      navigator.mediaDevices.enumerateDevices().then(callback);
    };
  }

  let MediaDevices = [];
  let isHTTPs = location.protocol === "https:";
  let canEnumerate = false;

  if (
    typeof MediaStreamTrack !== "undefined" &&
    "getSources" in MediaStreamTrack
  ) {
    canEnumerate = true;
  } else if (
    navigator.mediaDevices &&
    !!navigator.mediaDevices.enumerateDevices
  ) {
    canEnumerate = true;
  }

  let hasMicrophone = false;
  let hasSpeakers = false;
  let hasWebcam = false;

  let isMicrophoneAlreadyCaptured = false;
  let isWebcamAlreadyCaptured = false;
  if (!canEnumerate) {
    return;
  }

  if (
    !navigator.enumerateDevices &&
    window.MediaStreamTrack &&
    window.MediaStreamTrack.getSources
  ) {
    navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
      window.MediaStreamTrack
    );
  }

  if (!navigator.enumerateDevices && navigator.enumerateDevices) {
    navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
  }

  if (!navigator.enumerateDevices) {
    if (callback) {
      callback();
    }
    return;
  }

  MediaDevices = [];
  navigator.enumerateDevices(function (devices) {
    devices.forEach(function (_device) {
      let device = {};
      for (let d in _device) {
        device[d] = _device[d];
      }

      if (device.kind === "audio") {
        device.kind = "audioinput";
      }

      if (device.kind === "video") {
        device.kind = "videoinput";
      }

      let skip;
      MediaDevices.forEach(function (d) {
        if (d.id === device.id && d.kind === device.kind) {
          skip = true;
        }
      });

      if (skip) {
        return;
      }

      if (!device.deviceId) {
        device.deviceId = device.id;
      }

      if (!device.id) {
        device.id = device.deviceId;
      }

      if (!device.label) {
        device.label = "Please invoke getUserMedia once.";
        if (!isHTTPs) {
          device.label =
            "HTTPs is required to get label of this " +
            device.kind +
            " device.";
        }
      } else {
        if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
          isWebcamAlreadyCaptured = true;
        }

        if (device.kind === "audioinput" && !isMicrophoneAlreadyCaptured) {
          isMicrophoneAlreadyCaptured = true;
        }
      }

      if (device.kind === "audioinput") {
        hasMicrophone = true;
      }

      if (device.kind === "audiooutput") {
        hasSpeakers = true;
      }

      if (device.kind === "videoinput") {
        hasWebcam = true;
      }

      // there is no 'videoouput' in the spec.

      MediaDevices.push(device);
    });

    if (callback) {
      callback({ hasWebcam, hasMicrophone, hasSpeakers });
    }
  });
}

export function checkSensors() {
  //   for (let sensor in sensors) {
  //     navigator.permissions.query({ name: "geolocation" }).then((result) => {
  //       if (result.state === "granted") {
  //         showMap();
  //       } else if (result.state === "prompt") {
  //         showButtonToEnableMap();
  //       }
  //       // Don't do anything if the permission was denied.
  //     });
  //   }
  // Gyroscope
  let results = {};
  let gyroscope = null;
  try {
    gyroscope = new Gyroscope({ referenceFrame: "device" });
    gyroscope.addEventListener("error", (event) => {
      // Handle runtime errors.
      if (event.error.name === "NotAllowedError") {
        // Branch to code for requesting permission.
      } else if (event.error.name === "NotReadableError") {
        console.log("Cannot connect to the sensor.");
      }
    });
    // gyroscope.addEventListener("reading", () => reloadOnShake(gyroscope));
    results["gyroscope"] = gyroscope;
    gyroscope.start();
  } catch (error) {
    // Handle construction errors.
    if (error.name === "SecurityError") {
      // See the note above about feature policy.
      console.log("Sensor construction was blocked by a feature policy.");
    } else if (error.name === "ReferenceError") {
      console.log("Sensor is not supported by the User Agent.");
    } else {
      throw error;
    }
  }
  // accelerometer
  let accelerometer = null;
  try {
    accelerometer = new LinearAccelerationSensor({ referenceFrame: "device" });
    accelerometer.addEventListener("error", (event) => {
      // Handle runtime errors.
      if (event.error.name === "NotAllowedError") {
        // Branch to code for requesting permission.
      } else if (event.error.name === "NotReadableError") {
        console.log("Cannot connect to the sensor.");
      }
    });
    // accelerometer.addEventListener("reading", () =>
    //   reloadOnShake(accelerometer)
    // );
    results["accelerometer"] = accelerometer;
    accelerometer.start();
  } catch (error) {
    // Handle construction errors.
    if (error.name === "SecurityError") {
      // See the note above about feature policy.
      console.log("Sensor construction was blocked by a feature policy.");
    } else if (error.name === "ReferenceError") {
      console.log("Sensor is not supported by the User Agent.");
    } else {
      throw error;
    }
  }
  return results;
}
