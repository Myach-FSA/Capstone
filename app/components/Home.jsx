import React from 'react';
import ReactDOM, { render } from 'react-dom';
import PlayNow from './PlayNow';

const Home = () => (
  <section id="contain" className="hero">
    <div className='homeContainer'>
      <PlayNow />
    </div>
    <div className='notification homeScreen'>
      <img id='tutorial' src="/assets/howtoplay.png" />
    </div>
    <div className="slider">
      <img id="photoobj" className="media-object" src='assets/textures/blue_walkway_thin.png' />
    </div>
  </section>
);

export default Home;
