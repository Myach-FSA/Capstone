import React from 'react'

import firebase from 'APP/fire'

// const google = new firebase.auth.GoogleAuthProvider()

// Firebase has several built in auth providers:
const facebook = new firebase.auth.FacebookAuthProvider()
// // const twitter = new firebase.auth.TwitterAuthProvider()
// // const github = new firebase.auth.GithubAuthProvider()
// // // This last one is the email and password login we all know and
// // // vaguely tolerate:
const email = new firebase.auth.EmailAuthProvider()

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

export default ({ auth }) =>
  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
  // redirect. If you prefer, you can signInWithRedirect, which always
  // redirects.
  <button className='email login'
          onClick={() => auth.signInWithPopup(email)}>Login with Email</button>


// const Login = () => {

//   const email = new firebase.auth.EmailAuthProvider()

//     return (
//       <div className="columns">
//       <div className="column is-one-third">
//       </div>
//       <div className="column is-one-third columnspace formspacing">
//         <form className="formspacing" onSubmit={evt => {
//           evt.preventDefault()
//         }}>
//           <div className="field">
//             <p className="control has-icons-left has-icons-right">
//               <input name="email" className="input" type="email" placeholder="Email" />
//               <span className="icon is-small is-left">
//                 <i className="fa fa-envelope"></i>
//               </span>
//               <span className="icon is-small is-right">
//                 <i className="fa fa-check"></i>
//               </span>
//             </p>
//           </div>
//           <div className="field">
//             <p className="control has-icons-left">
//               <input name="password" className="input" type="password" placeholder="Password" />
//               <span className="icon is-small is-left">
//                 <i className="fa fa-lock"></i>
//               </span>
//             </p>
//           </div>
//           <div className="field">
//             <p className="control ">
//               <button className="button is-success">
//                 Login
//               </button>
//             </p>
//           </div>

//           <div className="or buffer">
//             <div className="back-line">
//               <span>OR</span>
//             </div>
//           </div>
//         </form>
//         <div className="buffer oauth">
//           <button className="button is-danger email login"
//           onClick={() => firebase.auth.signInWithRedirect(email)}>Login with Email
//           </button>
//         </div>

//         <div className="column is-one-third"></div>
//       </div>
//     </div>

//     )
// }

// export default Login