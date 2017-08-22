import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';

class GameWaitRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      numberOfPlayers: 0,
      publicGame: false,
    };
  }
  componentDidMount() {
    const user = this.props.user;
    firebase.database().ref('games').update({ [user.gameId]: { playersInGame: [user.userId] } });
    this.getPlayers(user.gameId, true);
  }

  componentWillUnmount() {
    this.getPlayers(this.props.user.gameId, false);
  }

  getPlayers = (gameId, bool) => {
    if (bool) {
      firebase.database().ref('games').on('value', players => {
        this.setState({ numberOfPlayers: players.val()[gameId].playersInGame.length });
      });
    } else {
      // OB/JL: maybe move this into its own function or just into the componentWillUnmount directly
      firebase.database().ref('games').off();
    }
  }

  // OB/JL: consider renaming to `togglePublic`
  security = () => {
    this.setState({ publicGame: !this.state.publicGame });
  }

  // Will use sendInfo later for scene selection / public or private games
  sendInfo = (info) => {
    const database = firebase.database();
    const user = this.props.user;
    // firebase.database().ref('games/' + user.gameId).update({ security: this.state.security });
  }

  render() {
    const numPlayer = 1; // OB/JL: dead code
    return (
      <div>
        <div className="content has-text-centered">
          <div className="notification">
            <h1><strong>Your Game ID: {this.props.user.gameId}</strong></h1>
            <p>Send this code to your friends!</p>
          </div>
          <SceneList />
          <ChooseBall />
          <h5 id="greenText">Current number of connected players: {this.state.numberOfPlayers}</h5>
          <Link to={`/game`}>
            <button
              className="button is-success"
              type="submit"
              title="playbutton"
              onClick={() => { this.sendInfo(); }}>
              Play Now!
            </button>
          </Link>
          <a
            className="button is-success"
            type="submit"
            title="publicPrivate"
            onClick={() => { this.security(); }}>
            {this.state.publicGame && // OB/JL: consider ternary
            <i className="fa fa-unlock"> Public</i>
            }
            {!this.state.publicGame &&
            <i className="fa fa-lock"> Private</i>
            }
          </a>
        </div>
        <div>
          <h4></h4>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(GameWaitRoom);
