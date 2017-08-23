import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';
import { submitName } from '../reducers/auth';

class GameWaitRoom extends React.Component {
  constructor() {
    super();
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
        firebase.database().ref('games/' + user.gameId).set({ playersInGame: { [this.props.user.userId]: { 'create': false, 'score': 0, 'remove': false } } });
      } else {
        this.setState({ isAdmin: false })        
        firebase.database().ref('games/' + user.gameId + '/playersInGame/' + this.props.user.userId).set({ 'create': false, 'score': 0, 'remove': false });
      }
    });
    this.getPlayers(user.gameId, true);
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    this.setState({ canPlay: true })
    return differentBallId;
  }

  componentWillUnmount() {
    firebase.database().ref('games').off();
  }

  getPlayers = (gameId, bool) => {
    if (bool) {
      firebase.database().ref('games').on('value', players => {
        if (players.val()[gameId]) {
          this.setState({ numberOfPlayers: Object.keys(players.val()[gameId].playersInGame).length });
        }
      });
    }
  }

  security = () => {
    this.setState({ publicGame: !this.state.publicGame });
  }

  // Will use sendInfo later for scene selection / public or private games
  sendInfo = (info) => {
    const name = document.getElementById('nickname').value;
    this.props.submitName(name);
    firebase.database().ref('users/' + this.props.user.userId).update({ 'username': name });

    const database = firebase.database();
    const user = this.props.user;
    const userRef = firebase.database().ref('games/' + user.gameId);
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        database.ref('games/' + user.gameId + '/playersInGame/' + this.props.user.userId).set({ 'score': 0, 'create': true, 'remove': false });
      } else {
        database.ref('games/' + user.gameId + '/playersInGame/' + this.props.user.userId).update({ 'score': 0, 'create': true, 'remove': false });
      }
    });
    // firebase.database().ref('games/' + user.gameId).update({ security: this.state.security });
  }

  render() {
    
    const yesPlay = 
      <button
        className="button is-success is-large"
        type="submit"
        title="playbutton"
        onClick={() => { this.sendInfo(); }}
        >
        PLAY NOW!
      </button>
    const noCannotPlay =
      <button
      className="button is-success is-large"
      type="submit"
      title="playbutton"
      onClick={() => { this.sendInfo(); }}
      disabled>
      PLAY NOW!
    </button>
    
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
          <div id='centerButtons' className="field is-grouped">
            <p className="control">
              <Link to={`/game/${this.props.user.gameId}/play`}>
              </Link>
            </p>
            <p>
              { this.state.canPlay ? yesPlay : noCannotPlay }
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
