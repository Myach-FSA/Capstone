import React from 'react';
import ReactDOM, { render } from 'react-dom';
import firebase from '../../fire';
const database = firebase.database();

class Scores extends React.Component {
  constructor() {
    super();
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
        this.setState({ children: children });
      });
    });
  }
  componentWillUnmount() {
    database.ref('users/').off();
  }
  render() {
    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <div id="choose" className="notification">
            <h1 className='ingametext'><strong>Scores</strong></h1>
            <table>
              <thead>
                <tr>
                  <th id='tableList'><abbr title="Username">Username</abbr></th>
                  <th id='tableList'><abbr title="Won">Wins</abbr></th>
                  <th id='tableList'><abbr title="Lost">Losses</abbr></th>
                  <th id='tableList'><abbr title="Points">Total Points</abbr></th>
                </tr>
              </thead>
              <tbody>
                {this.state.children.map(child => {
                  return (
                    <tr key={child.userId}>
                      <th id='tableList'>{child.username}</th>
                      <th id='tableList'>{child.wins}</th>
                      <th id='tableList'>{child.losses}</th>
                      <th id='tableList'>{child.totalScore}</th>
                    </tr>);
                }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
}
// /* -----------------    CONTAINER     ------------------ */

import { fetchUser } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatch = ({ fetchUser });

export default connect(mapStateToProps, mapDispatch)(Scores);
