import React from 'react'
import ReactDOM, { render } from 'react-dom'

const Home = () => (
    <section id="contain" className="hero">
    <div className="slider">
    {/* OB/JL: make sure to include leading / in requests for files */}
    <img id="photoobj" className="media-object" src='assets/textures/blue_walkway_thin.png' />
    <div className="button is-success" id="overlay"><a href="#"> BUTTON </a></div>
    </div>
    </section>
  )

export default Home
