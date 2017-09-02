import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class NavbarSection extends React.Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logOut();
    this.props.history.push('/');
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
          <NavLink className="navbar-item itemsec" to="/about">
            about
          </NavLink>
          <NavLink className="navbar-item itemsec" to="/scores">
            scores
          </NavLink>
          <NavLink className="navbar-item itemsec" to="/choose">
            play now
          </NavLink>
        </div>
      </header>
    );
  }
};

/* -----------------    CONTAINER     ------------------ */

import { logOut } from '../reducers/auth';
import { connect } from 'react-redux';

const mapState = (state, componentProps) => (
  { user: state.auth }
);

const mapDispatch = ({ logOut });

export default withRouter(connect(mapState, mapDispatch)(NavbarSection));
