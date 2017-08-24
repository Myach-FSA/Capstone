import React from 'react';
import ReactDOM, { render } from 'react-dom';
import PlayNow from './PlayNow';

const Home = () => (
    <section id="contain" className="hero">
    <PlayNow />
    <div className="slider">
    <img id="photoobj" className="media-object" src='assets/textures/blue_walkway_thin.png' />
    </div>
    </section>
  );

export default Home;
