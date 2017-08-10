'use strict'
import React from 'react'
import {Route, Switch, Redirect, Link} from 'react-router-dom'
import Scratchpad from './scratchpad'
import Whiteboard from './whiteboard'
import Chat from './chat'

const Index = ({children}) => <div>
  <h1>Demos!</h1>
  <h2><Link to='/demos/scratchpad/welcome'>Scratchpad</Link></h2>
  <p>
    The scratchpad is the very simplest React/Firebase demo—a text area
    whose content is synced with Firebase.
  </p>

  <h2><Link to='/demos/chat/welcome'>Chat</Link></h2>
  <p>
    A chat room — the canonical Firebase example.
  </p>

  <h2><Link to='/demos/whiteboard/welcome'>Whiteboard</Link></h2>
  <p>
    The whiteboard demonstrates the <i>journal</i> pattern, a way to use Firebase
    to synchronize the state of Redux stores on all collaborators machines.
  </p>
</div>

export default <Switch path="/demos">
    <Route path="/demos/scratchpad/:title" component={Scratchpad}/>
    <Route path="/demos/whiteboard/:title" component={Whiteboard}/>
    <Route path="/demos/chat/:room" component={Chat}/>
    <Route exact path="/demos" component={Index}/>
  </Switch>
