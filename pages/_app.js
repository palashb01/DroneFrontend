import { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import '../styles/checkMyDevice.css'

import 'bootstrap/dist/css/bootstrap.css'       // bootstrap css
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap');     // bootstrap js
  }, [])
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
