import React from 'react';
import ReactDOM, { render } from 'react-dom';
import firebase from '../../fire';
const database = firebase.database();

class ScoreTable extends React.Component {
  render() {
    const { user } = this.props;
    console.log(this.props);
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
            {database.ref('users/').on('value', users => {
              for (const userId in users.val()) {
                console.log('user id', userId);
                database.ref('users/' + userId).on('value', user => {
                  console.log('user', userId, user.val().wins, user.val().losses, user.val().totalScore);
                  return (
                  <tr>
                    <th>{userId}</th>
                    <td>{user.val().wins}</td>
                    <td>{user.val().losses}</td>
                    <td>{user.val().totalScore}</td>
                  </tr>);
                });
              }
            })
            }
            {/* <tr>
              <th>1</th>
              <td><a href="https://en.wikipedia.org/wiki/Leicester_City_F.C." title="Leicester City F.C.">Leicester City</a> <strong>(C)</strong>
              </td>
              <td>38</td>
              <td>23</td>
              <td>12</td>
              <td>3</td>
            </tr>
            <tr>
              <th>2</th>
              <td><a href="https://en.wikipedia.org/wiki/Arsenal_F.C." title="Arsenal F.C.">Arsenal</a></td>
              <td>38</td>
              <td>20</td>
              <td>11</td>
              <td>7</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    );
  }
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
