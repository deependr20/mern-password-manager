import React from 'react'
import Navbar from './component/Navbar'
import Manager from './component/Manager'
import Footer from './component/Footer'

const App = () => {
  return (
    <div className='min-h-screen relative w-full bg-red-100 '>
          <Navbar />
          <Manager />
          <Footer />
    </div>
  )
}

export default App