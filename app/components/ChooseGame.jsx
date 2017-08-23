import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom'
import Firebase from 'firebase';

const games = [
  { name: 'Mount Death', description: 'Mountains and stuff', img: '/assets/textures/grayball-choose.png' },
  { name: 'Elysium', description: "Travel to the future", img: '/assets/textures/green_black_cubes.jpg' },
  { name: 'Adventure Island', description: "Sand and stuff", img: '/assets/textures/netball-choose.png' },  
]

class ChooseGame extends React.Component {
  constructor(props) {
    super(props)
    this.gameId = '';
    this.initiateGame = this.initiateGame.bind(this)
    this.joinGameId = this.joinGameId.bind(this)
  }

  gameChoice(evt) {
    this.gameId = +evt.target.id
    this.props.chooseGame(+evt.target.id)
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
    const chosenGame = games[this.props.user.gameId]
    const gameMessage = chosenGame ? `You have chosen ${chosenGame.name}` : 'You have not yet chosen an arena'
    const gameID = this.gameId && this.gameId

    return (
        <div className="content has-text-centered">
          <h1><strong>Choose Your Battleground</strong></h1>
            <h5>Pick a scene to join a random game or initiate/join a private game below.</h5>
            <h3>Join a Random Game</h3>
            <h5><strong>{gameMessage}</strong></h5>
            <div className="columns is-multiline">
                {games && games.map((game, i) => (
                  <article key={i}
                    className="column is-one-third product-grid-item">
                    <div key={i} className="inner-product">
                      <br />
                      <figure className="image">
                        <img src={game.img} id={i} alt="Image" onClick={(evt) => this.gameChoice(evt)}/>
                      </figure>
                      <p className="subtitle">{game.name}</p>
                      <p className="subtitle">{game.description}</p>
                      <button id={i} onClick={(evt) => this.gameChoice(evt)}
                        className="button is-success is-outlined playnow">
                        Choose Arena
                      </button>
                    </div>
                  </article>
                )
                )}
              </div>
            <h1><strong>Initiate or Join a Private Game</strong></h1>
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
            <br></br>
          <Link to={`/game/${gameID}/ball`} onClick={(evt) => this.sendDataToFB(evt)}><button className="button is-success">Continue</button></Link>
        <br></br>
        </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { setUser, chooseGame } from '../reducers/auth'
import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatch = ({ setUser, chooseGame })

export default connect(mapStateToProps, mapDispatch)(ChooseGame)
