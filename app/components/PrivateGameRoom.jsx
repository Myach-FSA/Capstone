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
    };
  }
  componentDidMount() {
    const user = this.props.user;

    var userRef = firebase.database().ref('games/' + user.gameId);
    userRef.once('value', (snapshot) => {
      var a = snapshot.exists();
      if (!a) {
        firebase.database().ref('games/' + user.gameId).set({ playersInGame: { [this.props.user.userId]: { 'score': 0, 'remove': false } } });
      } else {
        firebase.database().ref('games/' + user.gameId + '/playersInGame/' + this.props.user.userId).set({ 'score': 0, 'remove': false });
      }
    });
    this.getPlayers(user.gameId, true);
  }

  componentWillUnmount() {
    this.getPlayers(this.props.user.gameId, false);
  }

  submitUserName(evt) {
    evt.preventDefault();
    const name = document.getElementById('nickname').value;
    this.props.submitName(name);
  }

  getPlayers = (gameId, bool) => {
    if (bool) {
      firebase.database().ref('games').on('value', players => {
        this.setState({ numberOfPlayers: players.val()[gameId].playersInGame.length });
      });
    } else {
      firebase.database().ref('games').off();
    }
  }

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
    return (
      <div className='space'>
        <div className="content has-text-centered notification">
          <h1><strong>Enter Username</strong></h1>
          <div className="field has-addons">
            <p className="control">
              <input id='nickname' className="input" type="text" placeholder="Nickname" />
            </p>
            <p className="control">
              <button className="button is-success" onClick={(evt) => this.submitUserName(evt)}>
                Submit
              </button>
            </p>
          </div>
        </div>
        {this.state.isAdmin && (
          <div>
            <div className="content has-text-centered notification">
              <h1><strong>Your Game ID: {this.props.user.gameId}</strong></h1>
              <p>Send this code to your friends!</p>
            </div>
            <SceneList gameId={this.props.match.params.id} />
          </div>
        )}
        <ChooseBall />
        <div className="content has-text-centered notification">
          <h5 id="greenText">Current number of connected players: {this.state.numberOfPlayers}</h5>
          <div className="field is-grouped">
            <p className="control">
              <Link to={`/game/${this.props.user.gameId}/play`}>
                <button
                  className="button is-success"
                  type="submit"
                  title="playbutton"
                  onClick={() => { this.sendInfo(); }}>
                  Play Now!
              </button>
              </Link>
            </p>
            <p>
              <button
                className="button"
                type="submit"
                title="publicPrivate"
                onClick={() => { this.security(); }}>
                {this.state.publicGame &&
                  <i className="fa fa-unlock"> Public</i>
                }
                {!this.state.publicGame &&
                  <i className="fa fa-lock"> Private</i>
                }
              </button>
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
