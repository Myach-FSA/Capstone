// import React from 'react';
// import ReactDOM, { render } from 'react-dom';
// import { Link } from 'react-router-dom';

<<<<<<< HEAD
class GameWaitRoom extends React.Component {
  render() {
    const numPlayer = 1;
    return (
        <div className="content has-text-centered">
          <div className="notification">
            <h3>Waiting on Players</h3>
            <h5>Current number of connected players: {numPlayer}</h5>
            <Link to={`/game`}><button className="button is-info" type="submit" title="playbutton">Play Now!</button></Link>
          </div>
        </div>
    );
  }
}
=======
// class GameWaitRoom extends React.Component {
//   render() {
//     const numPlayer = 1;
//     return (
//         <div className="content has-text-centered">
//           <div className="notification">
//             <h3>Waiting on Players</h3>
//             <h5>Current number of connected players: {numPlayer}</h5>
//             <Link to={`/game`}><button className="button is-info" type="submit" title="playbutton">Play Now!</button></Link>
//               {/* <Link to={`/game`}>Play Now!</Link> */}
//           </div>
//         </div>
//     );
//   }
// }
>>>>>>> 26d1eeec6946e65f3e786690ed7920a0e089813d

// // /* -----------------    CONTAINER     ------------------ */

// import { connect } from 'react-redux';
// import store from '../store';

// const mapStateToProps = (state) => ({
//   user: state.auth.user
// });

// export default connect(mapStateToProps)(GameWaitRoom);
