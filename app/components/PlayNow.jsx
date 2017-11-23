import React from 'react';
import {Link} from 'react-router-dom';

const PlayNow = () => (
  <Link to="/choose">
    <img className="playNow" src="/assets/PlayNow.png"/>
  </Link>);

export default PlayNow;
