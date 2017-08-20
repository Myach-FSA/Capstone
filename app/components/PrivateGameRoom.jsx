import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom'
import SceneList from './SceneList'
import ChooseBall from './ChooseBall'

class GameWaitRoom extends React.Component {

  render() {
    let numPlayer = 1;
    return (
      <div>
        <div className="content has-text-centered">
          <div className="notification">
            <h1><strong>Your Game ID: {this.props.user.gameId}</strong></h1>
            <p>Send this code to your friends!</p>
          </div>
            <SceneList />
            <ChooseBall />
          <h5 id="greenText">Current number of connected players: {numPlayer}</h5>
          <Link to={`/game`}><button className="button is-success" type="submit" title="playbutton">Play Now!</button></Link>
        </div>
        <div>
          <h4></h4>
        </div>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(GameWaitRoom)