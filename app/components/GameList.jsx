import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { showGameList } from '../reducers/conditionals';
import { chooseGame } from '../reducers/auth';


class GameList extends React.Component {
  constructor() {
    super();
    this.state = {
      games: false,
    };
    this.selectGame = this.selectGame.bind(this)
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

  selectGame(evt) {
    let game = evt.target.name;
    this.props.chooseGame(game);            
    this.props.history.push(`/game/${game}/private`);    
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
              <th><abbr title='Select'>Select</abbr></th>
            </tr>
          </thead>
          <tbody>
            {this.state.games &&
              Object.keys(this.state.games).map((game) => {
                return (
                  <tr key={game} onClick={(evt) => this.selectGame(evt)}>
                    <th>{game}</th>
                    <th>RoomName placeholder</th>
                    <th>map name placeholder</th>
                    <th>[{this.state.games[game].playersInGame.length}/4]</th>
                    <th>Public/Private</th>
                    <th ><a name={game} className="button is-primary">JOIN</a></th>
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

const mapDispatch = ({ showGameList, chooseGame });


export default withRouter(connect(null, mapDispatch)(GameList));
