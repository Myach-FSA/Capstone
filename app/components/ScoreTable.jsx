import React from 'react';
import ReactDOM, { render } from 'react-dom';
import firebase from '../../fire';
const database = firebase.database();

class ScoreTable extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      children: []
    };
  }
  componentWillMount() {
    database.ref('users/').on('child_added', child => {
      const children=this.state.children;
      children.push(child.val());
      this.setState({children: children});
      database.ref('users/'+child.val().userId).on('value', snapshot => {
        const index=this.state.children.findIndex(element => element.userId===snapshot.val().userId);
        children[index]=snapshot.val();
        this.setState({children: children});
      });
    });
  }
  componentWillUnmount() {
    database.ref('users').off();
  }
  render() {
    return (
      <div id="ScoreTable" className="scoreTable invisible has-text-centered">
        <h1>Scores</h1>
        <table className="table">
          <thead>
            <tr>
              <th><abbr title="Username">Username</abbr></th>
              <th><abbr title="Won">Wins</abbr></th>
              <th><abbr title="Lost">Losses</abbr></th>
              <th><abbr title="Points">Total Points</abbr></th>
            </tr>
          </thead>
          <tbody>
            {this.state.children.map(child => {
              if (child.gameId===this.props.gameId) {
                return (
              <tr key={child.userId}>
                <th>{child.username}</th>
                <th>{child.wins}</th>
                <th>{child.losses}</th>
                <th>{child.totalScore}</th>
              </tr>);
              }
            }
            )}
          </tbody>
        </table>
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
