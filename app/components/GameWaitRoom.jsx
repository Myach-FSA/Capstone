import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SceneList from './SceneList';
import ChooseBall from './ChooseBall';

class GameWaitRoom extends React.Component {
  constructor(props) {
    super(props);
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
    firebase.database().ref('games/' + user.gameId).update({ security: this.state.security });
  }

  render() {
    let numPlayers = 0;
    const isAdmin = numPlayers === 0 ? true : false;
    console.log('numPlayers', numPlayers, 'isAdmin', isAdmin)

    return ( 
      <div>
        <div className="content has-text-centered">

          { isAdmin && (
            <div>
              <div className="notification">
                <h1><strong>Your Game ID: {this.props.user.gameId}</strong></h1>
                <p>Send this code to your friends!</p>
              </div>
              <SceneList gameId={this.props.match.params.id}/>
            </div>
            )
          }
          <ChooseBall />
          <h5 id="greenText">Current number of connected players: {this.state.numberOfPlayers}</h5>
          <div className="field is-grouped">
            <p className="control">
            <Link to={`/game/${this.props.user.gameId}`}>
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
        <div>
          <h4></h4>
        </div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(GameWaitRoom);
