import axios from 'axios';
import firebase from 'firebase';
import store from '.././store.js';

const initialState = {
  user: {}
};

/* --------- REDUCER --------- */

const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
  case SET:
    newState.user = action.user; break;
  case SIGN_OUT_USER:
    newState.user = {}; break;
  case LOGIN:
    newState.user = action.user;
    break;
  case SET_BALL:
    newState.user = { ...state.user, ball: action.ball };
    break;
  case SET_GAME:
    newState.user = { ...state.user, gameId: action.gameId };
    break;
  case SET_SCORE:
    const score = state.user.totalScore + Number(action.score);
    newState.user = { ...state.user, totalScore: score };
    break;
  case SET_USER_NAME:
    newState.user = { ...state.user, username: action.name };
    break;
  default:
    return state;
  }
  return newState;
};

/* --------- ACTIONS TYPES & CREATORS --------- */

const SET = 'SET_CURRENT_USER';
const set = user => ({ type: SET, user });

const SIGN_OUT_USER = 'SIGN_OUT_USER';
const signOutUser = () => ({ type: SIGN_OUT_USER });

const LOGIN = 'LOGIN';
const loginUser = (user) => ({ type: LOGIN, user });

const SET_BALL = 'SET_BALL';
const setBall = (ball) => ({ type: SET_BALL, ball });

const SET_GAME = 'SET_GAME';
const setGame = (gameId) => ({ type: SET_GAME, gameId });

const SET_SCORE = 'SET_SCORE';
const setScore = (score) => ({ type: SET_SCORE, score });

const SET_USER_NAME = 'SET_USER_NAME';
const setUserName = (name) => ({ type: SET_USER_NAME, name });

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
  };
  const ref = firebase.database().ref('users/'+user.userId);
  ref.set(userObj);

  return set(userObj);
};

export const login = (user) => {
  const loginObj = {};

  const ref = firebase.database().ref('users/' + user.id);
  ref.once('value', (snapshot) => {
    Object.assign(loginObj, snapshot.val());
  }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });
  console.log('This is the logged in user', loginObj);
  return loginUser(loginObj);
};

export const setUser = (user) => loginUser(user);

export const chooseBall = (ball) => setBall(ball);

export const chooseGame = (id) => setGame(id);

export const changeScore = (score) => setScore(score);

export const submitName = (name) => setUserName(name);

export function logOut() {
  firebase.auth().signOut();
  console.log('Firebase sign out', firebase.auth().currentUser);
  return signOutUser();
}

export default reducer;
