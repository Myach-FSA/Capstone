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
            {this.state.games &&
              Object.keys(this.state.games).map((game) => {
                return (
                  <tr key={game} onClick={(evt) => this.selectGame(evt)}>
                    <th id='tableList'>{game}</th>
                    <th id='tableList'>[{Object.keys(this.state.games[game].playersInGame).length}/4]</th>
                    <th id='tableList'>Public</th>
                    <th id='tableList'><a name={game} onClick={(evt) => this.selectGame(evt)} className="button is-primary">JOIN</a></th>
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
