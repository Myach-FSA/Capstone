import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Firebase from 'firebase';

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const userId = this.props.user.userId;
    const totalScore = this.props.user.totalScore || 0;

    return (
      <div id="InfoScreen" className="infoScreen has-text-centered">
        <br></br>
        <h4>Your Score: </h4>
        <h4>{totalScore}</h4>
        <br></br>
        <p>Points needed to win: </p>
        <p>{5 - totalScore}</p>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { setScore } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (state) => ({ user: state.auth.user });

const mapDispatch = ({ setScore });

export default connect(mapStateToProps, mapDispatch)(InfoScreen);
