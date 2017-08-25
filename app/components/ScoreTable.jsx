import React from 'react';
import ReactDOM, { render } from 'react-dom';
import firebase from '../../fire';
const database = firebase.database();

class ScoreTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: []
    };
  }
  componentWillMount() {
    database.ref('users/').on('child_added', child => {
      const children = this.state.children;
      children.push(child.val());
      this.setState({ children: children });
      database.ref('users/' + child.val().userId).on('value', snapshot => {
        const index = this.state.children.findIndex(element => element.userId === snapshot.val().userId);
        children[index] = snapshot.val();
        database.ref('games/' + snapshot.val().gameId + '/playersInGame/' + snapshot.val().userId + '/score').on('value', score => {
          children[index].score = score.val();
          this.setState({ children: children });
        });
        this.setState({ children: children });
      });
    });
  }
  componentWillUnmount() {
    database.ref('users/').off();
    database.ref('users/').once('value').then(allUsers => {
      const user = allUsers.val()[this.props.user.userId];
      database.ref('users/' + user.userId).off();
      database.ref('games/' + user.gameId + '/playersInGame/' + user.userId + '/score').off();
    });
  }
  render() {
    return (
      <div className="container is-fluid content has-text-centered">
        <div id="ScoreTable" className="scoreTable invisible has-text-centered notification">
          <h1><strong>Scores</strong></h1>
          <table>
            <thead>
              <tr>
                <th id='tableList'><abbr title="Username">Username</abbr></th>
                <th id='tableList'><abbr title="Won">Wins</abbr></th>
                <th id='tableList'><abbr title="Lost">Losses</abbr></th>
                <th id='tableList'><abbr title="Points">Points</abbr></th>
              </tr>
            </thead>
            <tbody>
              {this.state.children.map(child => {
                if (child.gameId === this.props.gameId) {
                  return (
                    <tr key={child.userId}>
                      <th id='tableList'>{child.username}</th>
                      <th id='tableList'>{child.wins}</th>
                      <th id='tableList'>{child.losses}</th>
                      <th id='tableList'>{child.score}</th>
                    </tr>);
                }
              }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
};

// /* -----------------    CONTAINER     ------------------ */

import { fetchUser } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatch = ({ fetchUser });

export default connect(mapStateToProps, mapDispatch)(ScoreTable);
