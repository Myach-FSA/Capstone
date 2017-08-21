import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { showGameList } from '../reducers/conditionals';

class GameList extends React.Component {
  constructor() {
    super();
    this.state = {
      games: [],
    };
  }
  componentWillMount() {
    const database = firebase.database();
    firebase.database().ref('games').once('value').then(allGames => {
      this.setState({ games: allGames.val() });
    });
  }

  componentWillUnmount() {
    this.props.showGameList(false);
  }

  back = () => {
    this.props.showGameList(false);
  }
  render() {
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th><abbr title='GameId'>GameId</abbr></th>
              <th><abbr title='RoomName'>Room Name</abbr></th>
              <th><abbr title='Map'>Map</abbr></th>
              <th><abbr title='NumPlayers'>Player #</abbr></th>
              <th><abbr title='Security'>Private / Public</abbr></th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(this.state.games).map((game) => {
                return (
                  <tr key={game}>
                    <th>{game}</th>
                    <th>RoomName placeholder</th>
                    <th>map name placeholder</th>
                    <th>[{this.state.games[game].playersInGame.length}/4]</th>
                    <th>Public/Private</th>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <button className='button is-primary' id='neon' onClick={() => this.back()}>
          Back
           </button>
      </div>
    );
  }
}

const mapDispatch = ({ showGameList });

export default connect(null, mapDispatch)(GameList);
