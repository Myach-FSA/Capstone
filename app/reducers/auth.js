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
    case SET_BALL: 
      newState.user = { ...state.user, ball: action.ball };
    break
    case SET_GAME: 
      newState.user = { ...state.user, gameId: action.gameId };
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

const SET_BALL = 'SET_BALL'
const setBall = (ball) => ({ type: SET_BALL, ball })

const SET_GAME = 'SET_GAME'
const setGame = (gameId) => ({ type: SET_GAME, gameId })

/* --------- THUNK CREATORS --------- */  

export const signUp = (user) => {
    const userObj = {
        userId: user.userId,
        email: user.email,
        username: user.username,
        wins: 0,
        totalScore: 0,
        losses: 0,
        ball: 0,
        gameId: 0,
    }
    const ref = firebase.database().ref("users/"+user.userId)
    ref.set(userObj)

   return set(userObj);
}

export const login = (user) => {
    let loginObj = {}

    const ref = firebase.database().ref('users/' + user.id)
    ref.once("value", (snapshot) => {
        Object.assign(loginObj, snapshot.val())
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    console.log('This is the logged in user', loginObj)
    return loginUser(loginObj);
}

export const setUser = (user) => {
    return loginUser(user);
}

export const chooseBall = (ball) => {
    return setBall(ball)
}

export const chooseGame = (id) => {
    return setGame(id)
}

// export const setBall = ball =>
//   dispatch =>
//     axios.get(`/api/products/${productId}`)
//       .then(res => res.data)
//       .then(product => {
//         dispatch(getSingleProduct(product))
//       })
//       .catch(err => {
//         console.error(`Error loading product with id: ${productId}`, err)
//       })
      

export function logOut() {
    firebase.auth().signOut()
    console.log('Firebase sign out', firebase.auth().currentUser);
    return signOutUser()
}

export default reducer