'use strict'
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {render} from 'react-dom'
import { Provider, connect } from 'react-redux'

import store from './store'

import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Game from './components/Game'
import Home from './components/Home'
import NavbarSection from './components/Navbar'
import FooterSection from './components/Footer'
import Scores from './components/Scores'
import ChooseBall from './components/ChooseBall'
import Register from './components/Register'
import GameWaitRoom from './components/GameWaitRoom'

import firebase from 'APP/fire'

import Demos from 'APP/demos'

const auth = firebase.auth()
let loginObj = {};

auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log('No user is signed in')
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log('Error: ', error.code, error.message)
    });
  } else {
    console.log(user, 'is signed in')    
    const ref = firebase.database().ref('users/' + user.uid)
    ref.once("value", (snapshot) => {
    Object.assign(loginObj, snapshot.val())
    })
  }
});

console.log('LoginObj', loginObj)

const App = ({ children }) =>
  <Router>
      <div>
      <NavbarSection />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/game" component={Game}/>
        <Route exact path="/choose" render={() => <ChooseBall auth={auth} loginObj={loginObj}/>}/>
        <Route exact path="/scores" component={Scores}/>
        <Route exact path="/login" render={() => <WhoAmI auth={auth} loginObj={loginObj}/>} />
        <Route exact path="/signup" render={() => <Register auth={auth} />} />
        <Route exact path="/game/:id" component={GameWaitRoom}/>
        <Route component={NotFound}/>
      </Switch>
      <FooterSection />
    </div>
  </Router>

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('content')
)
