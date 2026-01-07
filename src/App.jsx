import React from 'react'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Nav from './components/Nav.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const App = () => {

  return (
    <>
          <Router>
            <Nav />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
            </Routes>
          </Router>
    </>
  )
}

export default App
