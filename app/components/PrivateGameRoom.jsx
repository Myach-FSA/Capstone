import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';
import { submitName } from '../reducers/auth';

const db = firebase.database();

class GameWaitRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: true,
      numberOfPlayers: 0,
      publicGame: false,
      canPlay: false,
    };
  }

  componentDidMount() {
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    const userRef = db.ref(`games/${gameId}`);
    window.addEventListener('beforeunload', this.removeGame);
    userRef.once('value', (game) => {
      if (!game.exists()) {
        db.ref(`games/${gameId}`).set({ playersInGame: { [user]: { 'id': user, 'create': false, 'score': 0, 'ready': false } } });
        db.ref(`games/${gameId}/gameInfo/`).set({'admin': user, 'startGame': false, 'connectedPlayers': {[user]: user}});
      } else {
        db.ref(`games/${gameId}/gameInfo/connectedPlayers`).update({[user]: user});
        this.setState({isAdmin: false});
      }
    });
    db.ref(`games/${gameId}/gameInfo/connectedPlayers`).on('value', players => {
      if (players.val()) {
        const allPlayers = Object.keys(players.val());
        this.setState({numberOfPlayers: allPlayers.length});
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    this.setState({ canPlay: true });
    return differentBallId;
  }

  componentWillUnmount() {
    const user = this.props.user;
    // Prevents the game from being deleted if the user is entering the map
    if (this.props.history.location.pathname !== `/game/${user.gameId}/play`) {
      db.ref(`games/${user.gameId}/gameInfo/connectedPlayers/${user.userId}`).remove();
      db.ref(`games/${user.gameId}/gameInfo/admin`).once('value', (admin) => {
        if (admin.val() === user.userId) db.ref(`games/${user.gameId}`).remove();
      });
    }
    db.ref(`games/${user.gameId}/gameInfo/connectedPlayers`).off();
    window.removeEventListener('beforeunload', this.removeGame);
  }

  removeGame = () => {
    if (this.state.isAdmin) db.ref(`games/${this.props.user.gameId}`).remove();
    db.ref(`games/${this.props.user.gameId}/playersInGame/${this.props.user.userId}`).remove();
    db.ref(`games/${this.props.user.gameId}/gameInfo/connectedPlayers/${this.props.user.userId}`).remove();
  }

  startGame = (gameInfo) => {
    const user = this.props.user;
    const userRef = db.ref(`games/${user.gameId}`);
    const database = db;
    let name = document.getElementById('nickname').value;

    if (name === '') name = 'Anonymous ID: ' + user.userId.substr(0, 4);
    this.props.submitName(name);
    db.ref(`users/${user.userId}`).update({ 'username': name });
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        database.ref(`games/${user.gameId}/playersInGame/${user.userId}`).set({ 'id': user.userId, 'score': 0, 'create': true, 'ready': true });
      } else {
        database.ref(`games/${user.gameId}/playersInGame/${user.userId}`).update({ 'id': user.userId, 'score': 0, 'create': true, 'ready': true });
        if (this.state.isAdmin) {
          db.ref(`games/${user.gameId}/gameInfo/`).update({ 'startGame': true });
        }
      }
    });
  }

  render() {
    const showPlayButton =
      <button
        className="button is-success"
        type="submit"
        title="playbutton"
        onClick={() => { this.startGame(); }}
      >
        Ready!
    </button>;

    const disablePlayButon =
      <button
        className="button is-success"
        type="submit"
        title="playbutton"
        disabled
      >
        Play Now!
    </button>;

    const playNowButton = this.props.user.ball ? showPlayButton : disablePlayButon;

    return (
      <div className='space'>
        <div className="content has-text-centered notification">
          <h1><strong>Enter Your Name</strong></h1>
          <div id='centerInput' className="field has-addons">
            <p className="control">
              <input id='nickname' className="input" type="text" placeholder="Nickname" />
            </p>
          </div>
        </div>
        {this.state.isAdmin && (
          <div>
            <div className="content has-text-centered notification">
              <h1><strong>Your Game ID: {this.props.user.gameId}</strong></h1>
              <p>Send this code to your friends!</p>
            </div>
          </div>
        )}
        <ChooseBall />
        <div className="content has-text-centered notification">
          <h5 id="greenText">Current number of connected players: {this.state.numberOfPlayers}</h5>
          <div id='centerButtons' className="field is-grouped">
            <p className="control">
              <Link to={`/game/${this.props.user.gameId}/play`}>
                {playNowButton}
              </Link>
            </p>
          </div>
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

const mapDispatch = ({ submitName });

export default connect(mapStateToProps, mapDispatch)(GameWaitRoom);
