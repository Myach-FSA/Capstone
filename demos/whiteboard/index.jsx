import React from 'react'
import firebase from 'APP/fire'
const db = firebase.database()

import Whiteboard from './Whiteboard'

// This component is a little piece of glue between React router
// and our whiteboard component. It takes in props.params.title, and
// shows the whiteboard along with that title.
export default ({match: {params: {title}}}) =>
  <div>
    <h1>{title}</h1>
    {/* Here, we're passing in a Firebase reference to
        /whiteboards/$whiteboardTitle. This is where the whiteboard is
        stored in Firebase. Each whiteboard is an array of actions that
        users have dispatched into the whiteboard. */}
    <Whiteboard fireRef={db.ref('whiteboards').child(title)}/>
  </div>
