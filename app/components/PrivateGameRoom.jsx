import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';
import { submitName } from '../reducers/auth';

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
    const user = this.props.user;
    const userRef = firebase.database().ref(`games/${user.gameId}`);
    window.addEventListener('beforeunload', this.removeGame);
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        firebase.database().ref(`games/${user.gameId}`).set({ playersInGame: { [user.userId]: { 'id': user.userId, 'create': false, 'score': 0, 'ready': false } } });
        firebase.database().ref(`games/${user.gameId}/gameInfo/`).set({ 'admin': user.userId, 'startGame': false });
      } else {
        this.setState({ isAdmin: false });
        firebase.database().ref(`games/${user.gameId}/playersInGame/${user.userId}`).set({ 'id': user.userId, 'create': false, 'score': 0, 'ready': false });
      }
    });
    this.getPlayers(user.gameId, true);
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
      firebase.database().ref(`games/${user.gameId}/gameInfo/admin`).once('value', (admin) => {
        if (admin.val() === user.userId) {
          firebase.database().ref(`games/${user.gameId}`).remove();
        };
      });
    }
    firebase.database().ref('games').off();
    window.removeEventListener('beforeunload', this.removeGame);
  }

  removeGame = () => {
    firebase.database().ref(`games/${this.props.user.gameId}/playersInGame/${this.props.user.userId}`).remove();
    firebase.database().ref(`games/${this.props.user.gameId}/gameInfo/admin`).once('value', (admin) => {
      if (admin.val() === this.props.user.userId) {
        firebase.database().ref('games/' + this.props.user.gameId).remove();
      };
    });
  }

  getPlayers = (gameId, bool) => {
    if (bool) {
      firebase.database().ref('games').on('value', players => {
        if (players.val() && players.val()[gameId]) {
          this.setState({ numberOfPlayers: Object.keys(players.val()[gameId].playersInGame).length });
        }
      });
    }
  }

  sendInfo = (info) => {
    const user = this.props.user;
    const userRef = firebase.database().ref(`games/${user.gameId}`);
    const database = firebase.database();
    let name = document.getElementById('nickname').value;

    if (name === '') name = 'Anonymous ID: ' + user.userId.substr(0, 4);
    this.props.submitName(name);
    firebase.database().ref(`users/${user.userId}`).update({ 'username': name });
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        database.ref(`games/${user.gameId}/playersInGame/${user.userId}`).set({ 'score': 0, 'create': true, 'ready': true });
      } else {
        database.ref(`games/${user.gameId}/playersInGame/${user.userId}`).update({ 'score': 0, 'create': true, 'ready': true });
        if (this.state.isAdmin) {
          firebase.database().ref(`games/${user.gameId}/gameInfo/`).update({ 'startGame': true });
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
        onClick={() => { this.sendInfo(); }}
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
