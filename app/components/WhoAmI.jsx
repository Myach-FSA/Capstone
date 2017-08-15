import React from 'react'
import firebase from 'APP/fire'
const auth = firebase.auth()
import { NavLink } from 'react-router-dom';

// import Login from './Login'

// export const name = user => {
//   if (!user) return 'Nobody'
//   if (user.isAnonymous) return 'Anonymous'
//   return user.displayName || user.email
// }

// export const WhoAmI = ({ user, auth }) =>
//   <div className="whoami">
//     <span className="whoami-user-name">Hello, {name(user)}</span>
//     { // If nobody is logged in, or the current user is anonymous,
//       (!user || user.isAnonymous) ?
//         // ...then show signin links...
//         <Login auth={auth} />
//         /// ...otherwise, show a logout button.
//         : <button className='logout' onClick={() => auth.signOut()}>logout</button>}
//   </div>

export default class LoginUser extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    console.log('these are the props', this.props)
    const { auth } = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleLogin(email, password) {
    console.log('email, pw', email, password)
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
      console.log('Signed in with user: ', user);
    })
    .catch(function(error) {
      console.log("omg this didn't work")
      var errorCode = error.code;
      var errorMessage = error.message;
    });
    let person = user ? console.log('user', user) : console.log('nobody');
    console.log('this person', person)
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
          {/* 
            <div className="or buffer">
              <div className="back-line">
                <span>OR</span>
              </div>
            </div>
          </form>
          <div className="buffer oauth">
            <button className="button is-danger"
            onClick={() => auth.signInWithPopup(facebook)}>Sign in with Google
            </button>
          </div> */}

          <div className="column is-one-third"></div>
        </div>
      </div>
    )
  }
}

// /* -----------------    CONTAINER     ------------------ */

// import {login} from 'APP/app/reducers/auth'
// import {connect} from 'react-redux'

// const mapState = (state, componentProps) => (
//   {user: state.auth }
// )

// const mapDispatch = ({login})

// export default connect(mapState, mapDispatch)(Login)