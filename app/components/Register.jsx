import React from 'react';
import firebase from 'APP/fire';
const auth = firebase.auth();
import { Router, BrowserHistory, NavLink, withRouter } from 'react-router-dom';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(evt) {
    evt.preventDefault();

    const id = '';

    const email = evt.target.email.value;
    const password = evt.target.password.value;
    const username = evt.target.username.value;

    auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.props.signUp({ userId: user.uid, email, username });
      })
      .then(() => {
        this.props.history.push('/');
      })
      .catch(error => console.error(error));
  }

  render() {
    const { user } = this.state || {};
    return (
      <div className="columns">
        <div className="column is-one-third">
        </div>
        <div className="column is-one-third columnspace formspacing">
          <form className="formspacing" onSubmit={evt => this.handleSignUp(evt)}>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input name="username" className="input" type="username" placeholder="Username" />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fa fa-check"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input name="email" className="input" type="email" placeholder="Email" />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fa fa-check"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input name="password" className="input" type="password" placeholder="Password" />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control ">
                <button type="submit"
                  className="button is-primary">
                  Register
            </button>
              </p>
            </div>
          </form>
          <div className="column is-one-third"></div>
        </div>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { signUp } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapState = (state, componentProps) => (
  { user: state.user }
);

const mapDispatch = ({ signUp });

export default withRouter(connect(mapState, mapDispatch)(Register));
