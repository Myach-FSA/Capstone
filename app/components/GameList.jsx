import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom';
import Firebase from 'firebase';
import { connect } from 'react-redux';
import { showGameList } from '../reducers/conditionals';
import GameType from './GameType';

class GameList extends React.Component {
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
