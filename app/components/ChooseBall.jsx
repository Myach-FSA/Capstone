import React from 'react';
import ReactDOM, { render } from 'react-dom';

const ChooseBall = () => {
  return (
    <div className="content has-text-centered">
    <h1>Choose Your Ball</h1>    
    <a className="button is-success is-outlined" href="/game">Play Now!</a>
    </div>
  );
};

export default ChooseBall;