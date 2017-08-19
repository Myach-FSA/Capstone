import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom'
import Firebase from 'firebase';

const balls = [
  { name: 'Heavy Duty', description: 'Ball fashioned by the vikings themselves. This is the ball of choice for those serious about strength.', img: './assets/textures/grayball-choose.png' },
  { name: 'Sleuth', description: "You're efficient. You like things that move with the grace of a cheetah. Choose this ball if this describes you.", img: './assets/textures/netball-choose.png' },
]

class ChooseBall extends React.Component {
  constructor(props) {
    super(props)
      this.gameId = '';
    this.ballChoice = this.ballChoice.bind(this)
    this.initiateGame = this.initiateGame.bind(this)
    this.joinGameId = this.joinGameId.bind(this)
  }

  componentDidMount() {
    const anonymousUser = {
      userId: this.props.loginObj.uid,
      username: this.props.loginObj.uid,
      wins: 0,
      totalScore: 0,
      losses: 0,
      ball: 0,
      gameId: 0,
    }
    const user = this.props.loginObj.email ? this.props.loginObj : anonymousUser
    this.props.setUser(user)      
  }

  shouldComponentUpdate(nextProps){
    const differentGameRoomId = this.props.user.gameId !== nextProps.gameId;
    return differentGameRoomId
  }

  ballChoice(evt) {
    this.props.chooseBall(+evt.target.id)
  }

  initiateGame() {
    let num = (Math.floor(Math.random() * 90000) + 10000).toString();
    this.gameId = num;
    this.props.chooseGame(num)
    document.getElementById('gameID').value = num;
  }

  joinGameId() {
    let num = document.getElementById('gameInput').value;
    this.gameId = num;
    this.props.chooseGame(num)
  }

  sendDataToFB() {
    const user = this.props.user;
    const ref = firebase.database().ref("users/"+user.userId)
    ref.set(user)
    this.props.setUser(user)    
  }

  render() {
    const playerName = this.props.user.username  && this.props.user.username ? this.props.user.username : 'Anonymous'
    const chosenBall = balls[this.props.user.ball]
    const ballMessage = chosenBall ? `You have chosen ${chosenBall.name}` : 'You have not yet chosen a ball'
    const gameID = this.gameId && this.gameId

    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <h1><strong>Set Up Game</strong></h1>
          <div className="notification">
            <h3>Choose Your Ball</h3>
            <h5><strong>{ballMessage}</strong></h5>
            <div className="horiz-marg">
              <div className="columns is-multiline">
                {balls && balls.map((ball, i) => (
                  <article key={i}
                    className="column is-one-third product-grid-item">
                    <div key={ball.id} className="inner-product">
                      <br />
                      <figure className="image">
                        <img src={ball.img} id={i} alt="Image" onClick={(evt) => this.ballChoice(evt)}/>
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
          <i className="fa fa-arrow-down fa-lg" aria-hidden="true"></i>
          <br></br>
        </div>
        <div className="content has-text-centered">
          <div className="notification">
            <h3>Pick Your Game</h3>
            <h5>Select "Start New Game" below to initiate a game and send the code to your friends. Or you can join an already initiated game by entering a game ID below.</h5>
            <br></br>
            <div className="columns">
              <div className="column is-half">
                <h5>Get a game ID</h5>
                <div className="field has-addons">
                  <div className="control">
                    <a className="button is-info" onClick={(evt) => this.initiateGame(evt)}>
                      Start New Game
                  </a>
                  </div>
                  <div className="control">
                    <input id="gameID" className="input" type="text" placeholder="Game ID" disabled/>
                  </div>
                </div>
              </div>
              <div className="column">
                <h5>Join an initiated game</h5>
                <div className="field has-addons">
                  <div className="control">
                    <input id="gameInput" className="input" type="text" placeholder="Enter ID" />
                  </div>
                  <div className="control">
                    <a className="button is-info" onClick={(evt) => this.joinGameId(evt)}>
                      Enter Game ID
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link to={`/game/${gameID}`} onClick={(evt) => this.sendDataToFB(evt)}><button className="button is-success">Go to Game</button></Link>
          {/* <Link to={`/game/${gameID}`} onClick={(evt) => this.sendDataToFB(evt)}><button className="button is-success">Go to Game</button></Link> */}
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
