import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Route, Link, NavLink, Router, Switch, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import ChooseGame from './ChooseGame';
import GameList from './GameList';
import { setUser, chooseGame } from '../reducers/auth';
import { showGameList } from '../reducers/conditionals';
import { connect } from 'react-redux';

class GameType extends React.Component {
  constructor(props) {
    super(props);
    this.gameId = '';
    this.initiateGame = this.initiateGame.bind(this);
    this.sendDataToFB = this.sendDataToFB.bind(this);
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
    };
    const user = this.props.loginObj.email ? this.props.loginObj : anonymousUser;
    this.props.setUser(user);
    this.props.showGameList(false);
  }

  showJoinPage() {
    this.props.showGameList(true);
  }

  initiateGame() {
    const num = (Math.floor(Math.random() * 90000) + 10000).toString();
    this.gameId = num;
    this.props.chooseGame(num);
    this.props.history.push(`/game/${num}/private`);
  }

  sendDataToFB() {
    const user = this.props.user;
    const ref = firebase.database().ref('users/' + user.userId);
    ref.set(user);
    this.props.setUser(user);
  }

  render() {
    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <div id="choose" className="notification">
            <br></br>
            <div>
              {!this.props.gameList &&
                <div>
                  <p className="control">
                    <button className="button is-primary" id="neon" onClick={() => this.initiateGame()}>
                      Create a Game
                </button>
                  </p>
                  <p className="control">
                    <button className="button is-primary" id="neon" onClick={() => this.showJoinPage()}>
                      <Link to={`/choose`}>
                        Join a Game
                    </Link>
                    </button>
                  </p>
                </div>
              }
              {this.props.gameList &&
                <Switch>
                  <Route path={`/choose`} render={() => (
                    <GameList />
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
  gameList: state.conditionals.render
});

const mapDispatch = ({ setUser, chooseGame, showGameList });

export default withRouter(connect(mapStateToProps, mapDispatch)(GameType));
