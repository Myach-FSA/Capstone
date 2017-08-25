import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
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

    const userRef = firebase.database().ref('games/' + user.gameId);
 
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        firebase.database().ref('games/' + user.gameId).set({ playersInGame: { [this.props.user.userId]: { 'create': false, 'score': 0, 'remove': false, 'ready': false } } });
        firebase.database().ref('games/' + user.gameId + '/gameInfo/').set({ 'admin': this.props.user.userId, 'startGame': false });        
      } else {
        this.setState({ isAdmin: false })
        firebase.database().ref('games/' + user.gameId + '/playersInGame/' + this.props.user.userId).set({ 'create': false, 'score': 0, 'remove': false, 'ready': false });
      }
    });
    this.getPlayers(user.gameId, true);

    firebase.database().ref('games/' + user.gameId + '/gameInfo/startGame').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.props.history.push(`/game/${user.gameId}/play`)
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    this.setState({ canPlay: true })
    return differentBallId;
  }

  componentWillUnmount() {
    const user = this.props.user;
    
    firebase.database().ref('games').off();
    firebase.database().ref('games' + user.gameId + '/gameInfo/startGame').off();    
  }

  getPlayers = (gameId, bool) => {
    if (bool) {
      firebase.database().ref('games').on('value', players => {
        if (players.val()&&players.val()[gameId]) {
          this.setState({ numberOfPlayers: Object.keys(players.val()[gameId].playersInGame).length });
        }
      });
    }
  }

  security = () => {
    this.setState({ publicGame: !this.state.publicGame });
  }

  sendInfo = (info) => {
    let name = document.getElementById('nickname').value;
    if(name === '') name = 'Anonymous ID: ' + this.props.user.userId.substr(0, 4)
    this.props.submitName(name);
    firebase.database().ref('users/' + this.props.user.userId).update({ 'username': name });

    const user = this.props.user;
    const userRef = firebase.database().ref('games/' + user.gameId);
    const database = firebase.database();

    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        database.ref('games/' + user.gameId + '/playersInGame/' + user.userId).set({ 'score': 0, 'create': true, 'remove': false, 'ready': true });
      } else {
        database.ref('games/' + user.gameId + '/playersInGame/' + user.userId).update({ 'score': 0, 'create': true, 'remove': false, 'ready': true });
        if(this.state.isAdmin) {
          firebase.database().ref('games/' + user.gameId + '/gameInfo/').update({ 'startGame': true });        
        } 
      }
    });
    // firebase.database().ref('games/' + user.gameId).update({ security: this.state.security });
  }

  render() {
    
    const showPlayButton = 
    <div>
    <p className='has-text-centered'>Click below to notify the game creator that you are ready!</p>
    <button
      id='centerButtons'
      className="button is-success"
      type="submit"
      title="playbutton"
      onClick={() => { this.sendInfo(); }}
      >
      Ready!
    </button>
    </div>

    const showPlayButtonAdmin = 
    <div>
    <p className='has-text-centered'>Once players have connected, click the botton below to start the game!</p>
    <button
      id='centerButtons'
      className="button is-success"
      type="submit"
      title="playbutton"
      onClick={() => { this.sendInfo(); }}
      >
      Start Game
    </button>
    </div>

    const disablePlayButton = 
    <button
      className="button is-success"
      type="submit"
      title="playbutton"
      disabled
      >
      Play Now!
    </button>

    let playNowButton = disablePlayButton;

    if(this.props.user.ball) {
      if(this.state.isAdmin) {
        playNowButton = showPlayButtonAdmin;
      } else {
        playNowButton = showPlayButton;
      }
    }

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
            {/* <SceneList gameId={this.props.match.params.id} /> */}
          </div>
        )}
        <ChooseBall />
        <div className="content has-text-centered notification">
          <h5 id="greenText">Current number of connected players: {this.state.numberOfPlayers}</h5>
          <div id='centerButtons'>
            { playNowButton || playNowButtonAdmin }
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

export default withRouter(connect(mapStateToProps, mapDispatch)(GameWaitRoom));
