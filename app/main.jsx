'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Game from './components/Game'
import Home from './components/Home'
import NavbarSection from './components/Navbar'
import FooterSection from './components/Footer'
import Scores from './components/Scores'
import ChooseBall from './components/ChooseBall'
import Register from './components/Register'
// import Login from './components/Login'

import firebase from 'APP/fire'

import Demos from 'APP/demos'

const auth = firebase.auth()

auth.onAuthStateChanged(user => user || auth.signInAnonymously())
console.log('auth', auth)

const App = ({ children }) =>
  <Router>
      <div>
      <NavbarSection />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/game" component={Game}/>
        <Route exact path="/choose" component={ChooseBall}/>
        <Route exact path="/scores" component={Scores}/>
        <Route exact path="/login" render={() => <WhoAmI auth={auth} />} />
        <Route exact path="/signup" render={() => <Register auth={auth} />} />
        <Route component={NotFound}/>
      </Switch>
      <FooterSection />
    </div>
  </Router>

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content')
)
