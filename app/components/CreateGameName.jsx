import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { showGameList } from '../reducers/conditionals';
import { chooseGame } from '../reducers/auth';

class GameList extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className="content has-text-centered notification">
        <h1><strong>Enter Game Name</strong></h1>
            <div id='centerInput' className="field has-addons">
            <p className="control">
                <input id='gamename' className="input" type="text" placeholder="Game Name" />
            </p>
            </div>
        </div>
        <button className='button is-primary' id='neon'>
          Back
        </button>
      </div>
    );
  }
}

const mapDispatch = ({ showGameList, chooseGame });

export default withRouter(connect(null, mapDispatch)(GameList));
