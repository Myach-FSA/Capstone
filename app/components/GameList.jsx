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
      gamesObj: {},
      games: [],
    };
    this.selectGame = this.selectGame.bind(this);
  }
  componentDidMount() {
    const database = firebase.database();
    firebase.database().ref('games').once('value').then(allGames => {
      if (allGames.exists()) {
        const games = Object.keys(allGames.val());
        const gamesToList = games.filter((game) => {
          if (allGames.val()[game].hasOwnProperty('playersInGame')) {
            return true;
          }
        });
        this.setState({ gamesObj: allGames.val(), games: gamesToList });
      }
    });
  }

  componentWillUnmount() {
    this.props.showGameList(false);
  }

  selectGame(evt) {
    const game = evt.target.name;
    this.props.chooseGame(game);
    this.props.history.push(`/game/${game}/private`);
  }

  back = () => {
    this.props.showGameList(false);
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th id='tableList'><abbr title='GameId'>GameId</abbr></th>
              <th id='tableList'><abbr title='NumPlayers'>Player #</abbr></th>
              <th id='tableList'><abbr title='Security'>Private / Public</abbr></th>
              <th id='tableList'><abbr title='Select'>Select</abbr></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.games.map((game) => (
                  <tr key={game}>
                    <th id='tableList'>{game}</th>
                    <th id='tableList'>[{Object.keys(this.state.gamesObj[game].playersInGame).length}]</th>
                    <th id='tableList'>Public</th>
                    <th id='tableList'><a name={game} onClick={(evt) => this.selectGame(evt)} className="button is-primary">JOIN</a></th>
                  </tr>
                ))
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
