
import axios from 'axios'
// const auth = firebase.auth()
import Firebase from 'firebase';
import store from '.././store.js'


const initialState = {
  user: {}
}

/* --------- REDUCER --------- */

const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case SET:
      newState.user = action.user; break
    case SIGN_OUT_USER:
      newState.user = {}; break
    case LOGIN: 
      newState.user = action.user; 
      break      
    default:
      return state
  }

  return newState
}

/* --------- ACTIONS TYPES & CREATORS --------- */

const SET = 'SET_CURRENT_USER'
const set = user => ({ type: SET, user })

const SIGN_OUT_USER = 'SIGN_OUT_USER'
const signOutUser = () => ({ type: SIGN_OUT_USER })

const LOGIN = 'LOGIN'
const loginUser = (user) => ({ type: LOGIN, user })

/* --------- THUNK CREATORS --------- */  

export const signUp = (user) => {
    const userObj = {
        userId: user.userId,
        email: user.email,
        username: user.username,
        wins: 0,
        totalScore: 0,
        losses: 0,
        ball: ''
    }
    const ref = firebase.database().ref("users/"+user.userId)
    ref.set(userObj)

   return set(userObj);
}

export const login = (user) => {
    let loginObj = {}

    const ref = firebase.database().ref('users/' + user.id)
    ref.once("value", (snapshot) => {
        console.log('Snapshot', snapshot.val());
        Object.assign(loginObj, snapshot.val())
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    console.log('This is the logged in user', loginObj)
    return loginUser(loginObj);
}

export function logOut() {
    firebase.auth().signOut()
    console.log('Firebase sign out', firebase.auth().currentUser);
    return signOutUser()
}

export default reducer