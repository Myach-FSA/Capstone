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

import firebase from 'APP/fire'

import Demos from 'APP/demos'

const auth = firebase.auth()

auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({ children }) =>
  <Router>
      <div>
        <nav>
          <WhoAmI auth={auth} />
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/game" component={Game} />
          <Route component={NotFound} />
        </Switch>
      </div>
  </Router>

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content')
)
// render(
//   <Router>
//     <Switch>
//       <App />
//     </Switch>
//   </Router>,
//   document.getElementById('content')
// )
