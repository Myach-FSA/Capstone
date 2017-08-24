'use strict';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {render} from 'react-dom';
import { Provider, connect } from 'react-redux';

import store from './store';

import WhoAmI from './components/WhoAmI';
import NotFound from './components/NotFound';
import Game from './components/Game';
import Home from './components/Home';
import NavbarSection from './components/Navbar';
import FooterSection from './components/Footer';
import Scores from './components/Scores';
import ChooseBall from './components/ChooseBall';
import Register from './components/Register';
import PrivateGameRoom from './components/PrivateGameRoom';
import ChooseGame from './components/ChooseGame';
import GameType from './components/GameType';
import GameList from './components/GameList';

import firebase from 'APP/fire';

import Demos from 'APP/demos';

const auth = firebase.auth();
var loginObj = {};

auth.onAuthStateChanged((user) => {
  if (!user) {
    firebase.auth().signInAnonymously().catch(function(error) {
      console.error('Error: ', error.code, error.message);
    });
  } else {
    const ref = firebase.database().ref('users/' + user.uid);
    ref.once('value', (snapshot) => {
      Object.assign(loginObj, user);
    });
  }
});

const App = ({ children }) =>
  <Router>
      <div>
      <NavbarSection />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/game/:id/play" render={() => (
          loginObj.uid
          ? <Game auth={auth} loginObj={loginObj}/>
          : <Redirect to ='/' />)}/>
        <Route exact path="/game/:id/private" component={PrivateGameRoom}/>
        <Route exact path="/choose" render={() => <GameType auth={auth} loginObj={loginObj}/>}/>
        <Route exact path="/game/:id/ball" render={() => <ChooseBall auth={auth} loginObj={loginObj}/>}/>
        <Route exact path="/scores" component={Scores}/>
        <Route exact path="/login" render={() => <WhoAmI auth={auth} loginObj={loginObj}/>} />
        <Route exact path="/signup" render={() => <Register auth={auth} />} />
        <Route component={NotFound}/>
      </Switch>
      <FooterSection />
    </div>
  </Router>;

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('content')
);
