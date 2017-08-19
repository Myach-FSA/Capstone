import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Route, Link, NavLink, Router, Switch } from 'react-router-dom'
import Firebase from 'firebase';
import ChooseGame from './ChooseGame'

class GameType extends React.Component {
  constructor(props) {
    super(props)
        this.state = {
            renderJoinPage: false            
        }
    this.gameId = '';
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
  }

  showJoinPage() {
    let bool = !this.state.renderJoinPage
    this.setState({ renderJoinPage: bool })
  }

  initiateGame() {
    let num = (Math.floor(Math.random() * 90000) + 10000).toString();
    this.gameId = num;
    this.props.chooseGame(num)
    document.getElementById('gameID').value = num;
  }

  render() {

    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
        <div className="notification">
          <h1><strong>Create or Join a Game</strong></h1>
          <br></br>
          <div className="field is-grouped">
            <p className="control">
                <Link to={`/game/123/private`}>
                <button className="button is-primary">
                    Create a Game
                </button>
                </Link>
            </p>
            <p className="control">
                <button className="button is-primary" onClick={() => this.showJoinPage()}>
                    <Link to={`/choose`}>
                    Join a Game
                    </Link>
                </button>
            </p>
            {this.state.renderJoinPage &&
            <Switch>
              <Route path={`/choose`} render={() => (
                <ChooseGame />
              )} />
            </Switch>
            }
            </div>
            <br></br>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatch)(GameType)
