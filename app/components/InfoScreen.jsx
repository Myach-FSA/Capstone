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
        <p>You are { this.props.user.username }</p>
        <br></br>
        <p>Your Score: { totalScore } / 10</p>
        <br></br>
        <p>Click <strong>tab</strong> to see all scores</p>
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
