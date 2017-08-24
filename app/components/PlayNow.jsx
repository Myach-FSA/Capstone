import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Link} from 'react-router-dom';
import Firebase from 'firebase';

class PlayNow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Link to="/choose">
      <img className="playNow" src="/assets/PlayNow.png"/>
    </Link>);
  }
}

// / * -- -- -- -- -- -- -- -- -CONTAINER-- -- -- -- -- -- -- -- -- * /
export default PlayNow;
