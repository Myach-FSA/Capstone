import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom'

class GameWaitRoom extends React.Component {

  render() {

    return (
        <div className="content has-text-centered">
          <div className="notification">
            <h3>Waiting on Players</h3>
            <h5>Current number of connected players:</h5>
            <a className="button is-info" type="submit" title="playbutton" disabled>Play Now!</a>
              {/* <Link to={`/game`}>Play Now!</Link> */}
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