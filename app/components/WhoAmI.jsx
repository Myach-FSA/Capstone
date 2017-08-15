import React from 'react'
import firebase from 'APP/fire'
const auth = firebase.auth()
import { NavLink } from 'react-router-dom';

export default class LoginUser extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    console.log('these are the props', this.props)
    const { auth } = this.props
    // this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleLogin(email, password) {
    console.log('email, pw', email, password)
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('This is the user', user)
      } else {
        console.log('No user')
      }
    });
    this.props.history.push('/')
  }

  render() {
    const { user } = this.state || {}
    return (
      <div className="columns">
        <div className="column is-one-third">
        </div>
        <div className="column is-one-third columnspace formspacing">
          <form className="formspacing" onSubmit={evt => this.handleLogin(evt.target.email.value, evt.target.password.value)}>
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
                  Login
            </button>
              </p>
            </div>
          </form>
          <div className="column is-one-third"></div>
        </div>
      </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

// import {connect} from 'react-redux'

// const mapState = (state, componentProps) => (
//   {user: state.auth }
// )

// const mapDispatch = ({login})

// export default connect(mapState, mapDispatch)(Login)