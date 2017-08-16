import React from 'react';
import { NavLink } from 'react-router-dom';

class NavbarSection extends React.Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const { auth } = this.props
    // this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleLogout() {
    firebase.auth().signOut().then(function() {
      console.log('Sign out successful')
    }).catch(function(error) {
      console.log('Error occured while attempting to sign out')
    })
  };
  
  render() {
    return (
      <header className="nav headersec">
        <div className="container navbarsec">
          <NavLink className="navbar-item itemsec" to="/">
            <h1 className="title">
              M Y A C H
          </h1>
          </NavLink>
          <NavLink className="navbar-item itemsec" to="/scores">
            scores
          </NavLink>
          <NavLink className="navbar-item itemsec" to="/choose">
            play now
          </NavLink>
          <div id="navMenuExample" className="navbar-menu">
            <div className="navbar-end navbar-item has-dropdown is-hoverable">
              <NavLink className="navbar-link is-active has-text-centered" to="/profile">
                <div className="navbar-item title">
                  <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                </div>
              </NavLink>
              <div className="navbar-dropdown ">
                <NavLink className="navbar-item " to="/signup">
                  Register
                </NavLink>
                <NavLink className="navbar-item " to="/login">
                  Login
                </NavLink>
                <button className="navbar-item" onClick={evt => this.handleLogin(evt.target.email.value, evt.target.password.value)}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
};

export default NavbarSection;