import React from 'react'
import { NavLink } from 'react-router-dom'

const NavbarSection = () => (
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
              <NavLink className="navbar-item " to="/logout">
                Logout
              </NavLink>
            </div>
          </div>
        </div>
        </div>
        </header>
    )

export default NavbarSection
