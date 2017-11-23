import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';
import { submitName } from '../reducers/auth';
import Button from './Button';

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
    this.userId = this.props.user.userId;
    this.gameId = this.props.user.gameId;
  }

  componentDidMount() {
    const userRef = db.ref(`games/${this.gameId}`);
    window.addEventListener('beforeunload', this.removeGame);
    userRef.once('value', (game) => {
      if (!game.exists()) {
        db.ref(`games/${this.gameId}`).set({ playersInGame: { [this.userId]: { 'id': this.userId, 'create': false, 'score': 0, 'ready': false } } });
        db.ref(`games/${this.gameId}/gameInfo/`).set({'admin': this.userId, 'startGame': false, 'connectedPlayers': {[this.userId]: false}});
      } else {
        db.ref(`games/${this.gameId}/gameInfo/connectedPlayers`).update({[this.userId]: false});
        this.setState({isAdmin: false});
      }
    });
    db.ref(`games/${this.gameId}/gameInfo/connectedPlayers`).on('value', players => {
      if (players.val()) {
        const allPlayers = Object.keys(players.val());
        this.setState({numberOfPlayers: allPlayers.length});
      }
    });
    db.ref(`games/${this.gameId}/gameInfo`).on('value', gameInfo => {
      if (gameInfo.val()) {
        const lobbyInfo = gameInfo.val();
        const allPlayers = Object.keys(lobbyInfo.connectedPlayers);
        const playersNotReady = allPlayers.filter((player, index) => !lobbyInfo.connectedPlayers[allPlayers[index]]);
        if (gameInfo.val().startGame && !playersNotReady.length) {
          this.props.history.push(`/game/${this.props.user.gameId}/play`);
        } else if (gameInfo.val().startGame) {
          window.alert(`Players not ready: \n ${playersNotReady}`);
          db.ref(`games/${this.gameId}/gameInfo/`).update({ 'startGame': false });
        }
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    this.setState({ canPlay: true });
    return differentBallId;
  }

  componentWillUnmount() {
    // Prevents the game from being deleted if the user is entering the map
    if (this.props.history.location.pathname !== `/game/${this.gameId}/play`) {
      db.ref(`games/${this.gameId}/gameInfo/connectedPlayers/${this.userId}`).remove();
      db.ref(`games/${this.gameId}/gameInfo/admin`).once('value', (admin) => {
        if (admin.val() === this.userId) db.ref(`games/${this.gameId}`).remove();
      });
    }
    db.ref(`games/${this.gameId}/gameInfo/connectedPlayers`).off();
    db.ref(`games/${this.gameId}/gameInfo`).off();
    window.removeEventListener('beforeunload', this.removeGame);
  }

  removeGame = () => {
    if (this.state.isAdmin) db.ref(`games/${this.gameId}`).remove();
    db.ref(`games/${this.gameId}/playersInGame/${this.userId}`).remove();
    db.ref(`games/${this.gameId}/gameInfo/connectedPlayers/${this.userId}`).remove();
  }

  ready = async (gameInfo) => {
    let name = document.getElementById('nickname').value;
    if (!name) name = `ID: ${this.userId.substr(0, 4)}`;
    this.props.submitName(name);
    const playersReady = await db.ref(`games/${this.gameId}/gameInfo/connectedPlayers`).once('value');
    const check = playersReady.val();
    const ready = this.state.isAdmin ? true: !check[this.userId];
    db.ref(`games/${this.gameId}/gameInfo/connectedPlayers`).update({[this.userId]: ready});
    db.ref(`users/${this.userId}`).update({ 'username': name });
    db.ref(`games/${this.gameId}/gameInfo`).once('value', (gameInfo) => {
      db.ref(`games/${this.gameId}/playersInGame/${this.userId}`).set({ 'id': this.userId, 'score': 0, 'create': true, 'ready': true });
      if (this.state.isAdmin) {
        db.ref(`games/${this.gameId}/gameInfo/`).update({ 'startGame': true });
      }
    });
  }

  render() {
    const buttonState = this.props.user.ball;
    const startButton = <Button ready={this.ready} title={'Start'} disabled={!buttonState}/>;
    const readyButton = <Button ready={this.ready} title={'Ready'} disabled={!buttonState} />;
    const playNowButton = this.state.isAdmin ? startButton : readyButton;

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
                {playNowButton}
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
