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

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentDidMount() {
    console.log('these are the props', this.props)
    const { auth } = this.props
    // this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleSignUp(username, name, email, password, motto) {
    console.log('username', username, name, email)
    firebase.auth().createUserWithEmailAndPassword({
      email: email,
      password: password
    })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
      })
      .catch(function(error) {
        console.log("Error creating new user:", error);
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
          <form className="formspacing" 
            onSubmit={evt => 
                this.handleSignUp(
                    evt.target.username.value,
                    evt.target.name.value,
                    evt.target.email.value, 
                    evt.target.password.value,
                    evt.target.motto.value 
                )}>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input name="username" className="input" type="username" placeholder="User Name" />
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
                <input name="name" className="input" type="name" placeholder="Name" />
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
              <p className="control has-icons-left">
                <input name="motto" className="input" type="motto" placeholder="Motto" />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control ">
                <button type="submit"
                  className="button is-primary">
                  Submit
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

// /* -----------------    CONTAINER     ------------------ */

// import {login} from 'APP/app/reducers/auth'
// import {connect} from 'react-redux'

// const mapState = (state, componentProps) => (
//   {user: state.auth }
// )

// const mapDispatch = ({login})

// export default connect(mapState, mapDispatch)(Login)