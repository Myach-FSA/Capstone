
import axios from 'axios'
// const auth = firebase.auth()
import Firebase from 'firebase';


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
// const AUTHENTICATED = 'AUTHENTICATED'
// export const authenticated = user => ({
//   type: AUTHENTICATED, user
// })

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
    ref.on("value", (snapshot) => {
        console.log('Snapshot', snapshot.val());
        Object.assign(loginObj, snapshot.val())
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return loginUser(loginObj);
}

export function logOut() {
    firebase.auth().signOut()
    console.log('Firebase sign out', firebase.auth().currentUser);
    return signOutUser()
}

export default reducer



    // .then(response => {
    //   id = response.uid
    //   let user = firebase.auth().currentUser;
    //   this.props.login(response.uid, username)
    // })    

    // old firebones stuff for reference

    // export const name = user => {
//   if (!user) return 'Nobody'
//   if (user.isAnonymous) return 'Anonymous'
//   return user.displayName || user.email
// }

// export const WhoAmI = ({ user, auth }) =>
//   <div className="whoami">
//     <span className="whoami-user-name">Hello, {name(user)}</span>
//     { // If nobody is logged in, or the current user is anonymous,
//       (!user || user.isAnonymous) ?
//         // ...then show signin links...
//         <Login auth={auth} />
//         /// ...otherwise, show a logout button.
//         : <button className='logout' onClick={() => auth.signOut()}>logout</button>}
//   </div>
