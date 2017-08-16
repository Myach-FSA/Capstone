
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
    console.log(ref)
    ref.set(userObj)

   return set(userObj);
}

export const login = (user) => {

    console.log('This is the id in auth', user)

    const ref = firebase.database().ref('users' + user.id + totalScore)

    console.log('This is the ref', ref)

    ref.once("value").then((snapshot) => {
        const key = snapshot.key;
    })
    
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
