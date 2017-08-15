import React from 'react';
import ReactDOM, { render } from 'react-dom';

const Home = () => {
  return (
    <section className="hero">
    <div className="slider">
    <img id="photoobj" className="media-object" src='https://images.unsplash.com/photo-1464621922360-27f3bf0eca75?dpr=1&auto=format&fit=crop&w=1080&h=720&q=80&cs=tinysrgb&crop=' />
    </div>
    {/* <div className="hero-body">
      <div className="container">
      <img id="photoobj" className="media-object" src='https://images.unsplash.com/photo-1500667119810-2c9480a13ae6?dpr=1&auto=format&fit=crop&w=1080&h=720&q=80&cs=tinysrgb&crop=' />
      </div>
    </div> */}
    </section>
  );
};

export default Home;