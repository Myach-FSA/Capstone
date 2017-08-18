import React from 'react';
import ReactDOM, { render } from 'react-dom';

class ScoreTable extends React.Component {
  render() {
    const { user } = this.props

    return (
      <div id="ScoreTable" className="scoreTable invisible has-text-centered">
        <h1>Scores</h1>
      <table className="table">
      <thead>
      <tr>
          <th><abbr title="Position">Position</abbr></th>
          <th>Username</th>
          <th><abbr title="Played">Wins</abbr></th>
          <th><abbr title="Won">Losses</abbr></th>
          <th><abbr title="Drawn">Total Points</abbr></th>
          <th><abbr title="Lost">Motto</abbr></th>
      </tr>
      </thead>
      <tbody>
      <tr>
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
      </tr>
      </tbody>
      </table>
      </div>
    );
  }
};

// /* -----------------    CONTAINER     ------------------ */

import {fetchUser} from '../reducers/auth'
import {connect} from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatch = ({ fetchUser })

export default connect(mapStateToProps, mapDispatch)(ScoreTable)