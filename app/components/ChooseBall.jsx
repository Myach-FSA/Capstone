import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom'

const balls = [
  { name: 'Heavy Duty', description: 'Ball fashioned by the vikings themselves. This is the ball of choice for those serious about strength.', img: './assets/textures/grayball-choose.png' },
  { name: 'Sleuth', description: "You're efficient. You like things that move with the grace of a cheetah. Choose this ball if this describes you.", img: './assets/textures/netball-choose.png' },
]

class ChooseBall extends React.Component {
  constructor(props) {
    super(props)
      this.gameId = '';
    this.ballChoice = this.ballChoice.bind(this)
    this.gameChoice = this.gameChoice.bind(this)
  }

  componentDidMount() {
    const user = this.props.loginObj
    console.log('This is the user', user)
    this.props.setUser(user)
  }

  shouldComponentUpdate(nextProps){
    const differentGameRoomId = this.props.user.gameId !== nextProps.gameId;
    console.log('diff', differentGameRoomId)
    return differentGameRoomId
  }

  ballChoice(evt) {
    this.props.chooseBall(+evt.target.id)
  }

  gameChoice() {
    const num = (Math.floor(Math.random() * 90000) + 10000).toString();
    this.gameId = num;
    this.props.chooseGame(num)
    document.getElementById('gameID').value = num;
  }

  render() {
    console.log('is the user here? ', this.props.user.username)
    const playerName = this.props.user.username ? this.props.user.username : 'Anonymous'
    
    const gameID = this.gameId && this.gameId
    console.log('This is the gameID', gameID)

    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <h1>Hi <strong>{playerName}</strong></h1>
          <div className="notification">
            <h3>Choose Your Ball</h3>
            <i className="fa fa-arrow-down fa-lg" aria-hidden="true"></i>
            <div className="horiz-marg">
              <div className="columns is-multiline">
                {balls && balls.map((ball, i) => (
                  <article key={i}
                    className="column is-one-third product-grid-item">
                    <div key={ball.id} className="inner-product">
                      <br />
                      <figure className="image">
                        <img src={ball.img} alt="Image" />
                      </figure>
                      <p className="subtitle">{ball.name}</p>
                      <p className="subtitle">{ball.description}</p>
                      <button id={i} onClick={(evt) => this.ballChoice(evt)}
                        className="button is-success is-outlined playnow">
                        Choose Ball
                      </button>
                    </div>
                  </article>
                )
                )}
              </div>
            </div>
          </div>
          <br></br>
        </div>
        <div className="content has-text-centered">
          <div className="notification">
            <h3>Pick Your Game</h3>
            <i className="fa fa-arrow-down fa-lg" aria-hidden="true"></i>
            <br></br>
            <div className="columns">
              <div className="column is-half">
                <h5>Initiate a Game and send the code to your friends</h5>
                <div className="field has-addons">
                  <div className="control">
                    <a className="button is-info" onClick={(evt) => this.gameChoice(evt)}>
                      Start New Game
                  </a>
                  </div>
                  <div className="control">
                    <input id="gameID" className="input" type="text" placeholder="Game ID" disabled/>
                  </div>
                </div>
              </div>
              <div className="column">
                <h5>Enter a specific game room ID</h5>
                <div className="field has-addons">
                  <div className="control">
                    <input className="input" type="text" placeholder="Enter ID" />
                  </div>
                  <div className="control">
                    <a className="button is-info">
                      Enter Game
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link to={`/game/${gameID}`}><button className="button is-success">BACK TO STUDENTS</button></Link>
        <br></br>
        </div>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { setUser, chooseBall, chooseGame } from '../reducers/auth'
import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatch = ({ setUser, chooseBall, chooseGame })

export default connect(mapStateToProps, mapDispatch)(ChooseBall)