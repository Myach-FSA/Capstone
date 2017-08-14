'use strict'
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {render} from 'react-dom'

import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Game from './components/Game'
import Home from './components/Home'

import firebase from 'APP/fire'

import Demos from 'APP/demos'

const auth = firebase.auth()

auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({children}) =>
  <div>
    <nav>
      <WhoAmI auth={auth}/>
    </nav>
    <Switch>
      <Route exact path="/game" component={Game}/>
      <Route exact path="/" component={Home}/>
      <Route component={NotFound}/>
    </Switch>
  </div>

render(
  <Router>
    <Switch>
      <App />
    </Switch>
  </Router>,
  document.getElementById('content')
)
