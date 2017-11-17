/* global BABYLON */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../fire';
import { changeScore } from '../reducers/auth';
import createScene1 from './Scene1';
import InfoScreen from './InfoScreen';
import ScoreTable from './ScoreTable';
import WinScreen from './WinScreen';
import MuteSound from './MuteSound';
import balls from './balls';
import control from './Control';
import * as gameUtils from '../utils/gameFn';

const database = firebase.database();
let torus;
let winPos;
let zAcceleration = 0;
let xAcceleration = 0;
const yAcceleration = 0;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersInGame: [],
      objects: [],
      info: {},
    };
  }
  componentDidMount() {
    audio0.play();
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    const canvas = this.refs.renderCanvas;
    const engine = new BABYLON.Engine(canvas, true);
    let texture;
    const scene = createScene1(canvas, engine);

    database.ref('games/' + gameId + '/playersInGame').on('value', (players) => {
      const playersObj = players.val();
      for (const playerId in playersObj) {
        if (!this.state.playersInGame.includes(playerId) && playersObj[playerId].create) {
          database.ref('users/' + playerId + '/ball').once('value', (playersTexture) => {
            texture = playersTexture.val();
          });
          const newPlayer = gameUtils.createPlayerOnConnect(scene, playerId, texture);
          if (newPlayer.id === user) {
            gameUtils.playerPosition(newPlayer);
            gameUtils.setTexture(newPlayer, texture, scene);
            this.setState({ info: { x: newPlayer.position.x, y: newPlayer.position.y, z: newPlayer.position.z, gameId } });
            database.ref('playerPosition/' + newPlayer.id).set(this.state.info);
          } else {
            gameUtils.setTexture(newPlayer, texture, scene);
            database.ref('playerPosition/' + playerId).on('value', (playerInfo) => {
              if (playerInfo.val()) {
                const x = playerInfo.val().x;
                const y = playerInfo.val().y;
                const z = playerInfo.val().z;
                gameUtils.setPosition(newPlayer, x, y, z);
              }
            });
          }
          const newState = this.state.objects.slice();
          const newPlayersState = this.state.playersInGame.slice();
          newState.push(newPlayer);
          newPlayersState.push(playerId);
          this.setState({ objects: newState });
          this.setState({ playersInGame: newPlayersState });
          if (playerId === user) {
            const playerDummy = gameUtils.createCameraObj(scene, newPlayer);
            control(newPlayer, this.state.info);
            gameUtils.followCameraView(scene, playerDummy, canvas);
          }
          database.ref(newPlayer.id).on('value', (otherPlayer) => {
            if (otherPlayer.val()) {
              if (!newPlayer.physicsImpostor.isDisposed) {
                newPlayer.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(otherPlayer.val().zAcceleration, 0, otherPlayer.val().xAcceleration, 0));
              }
            }
          });
        }
      }
    });

    database.ref('games/' + gameId).update({ 'winPosition': { x: 10, z: 10 } });
    this.createWinPoint();
    database.ref('games/' + gameId + '/winPosition').on('value', (position) => {
      winPos = position.val();
    });

    database.ref('games/' + gameId + '/playersInGame/winner').on('value', (winner) => {
      if (winner.val()) {
        if (user === winner.val()) {
          database.ref('users/' + user + '/wins').transaction((wins) => {
            wins += 1;
            return wins;
          });
        } else {
          database.ref('users/' + user + '/losses').transaction((losses) => {
            losses += 1;
            return losses;
          });
        }

        const myScore = this.props.user.totalScore;
        this.props.changeScore(-myScore);
        database.ref('games/' + gameId + '/playersInGame/' + user).update({ 'score': 0 });
        database.ref('games/' + gameId + '/playersInGame/winner').remove();
      }
    });

    engine.runRenderLoop(() => {
      if (winPos) {
        if ((torus.position.x !== winPos.x) || (torus.position.z !== winPos.z)) {
          torus.position.x = winPos.x;
          torus.position.z = winPos.z;
        }
      }
      const me = this.state.objects.filter(player => player.id === user)[0];
      if (me && me.absolutePosition.y < -25) {
        while (me.position.y < 0) {
          gameUtils.playerPosition(me);
        }
        database.ref(user).set({ 'xAcceleration': 0, 'zAcceleration': 0 });
        me.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        xAcceleration = 0;
        zAcceleration = 0;
        database.ref('users/' + user + '/totalScore').transaction((score) => {
          score -= 1;
          return score;
        });
        database.ref('games/' + gameId + '/playersInGame/' + user + '/score').transaction((score) => {
          this.props.changeScore(-1);
          score -= 1;
          return score;
        });
      }
      if (winPos) {
        if (me && (Math.floor(me.absolutePosition.x) === winPos.x) && (Math.floor(me.absolutePosition.z) === winPos.z)) {
          database.ref('users/' + user + '/totalScore').transaction((score) => {
            score += 1;
            return score;
          });
          database.ref('games/' + gameId + '/playersInGame/' + user + '/score').transaction((score) => {
            this.props.changeScore(1);
            score += 1;
            if (score >= 10) {
              database.ref('games/' + gameId + '/playersInGame/').update({ 'winner': user });
              score = 0;
            }
            return score;
          });
          const x = Math.floor(Math.random() * 50 - 25);
          const z = Math.floor(Math.random() * 50 - 25);
          database.ref('games/' + gameId + '/winPosition').set({ 'x': x, 'z': z });
        }
      }
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
    window.addEventListener('beforeunload', () => {
      database.ref('games/' + gameId + '/playersInGame/' + user).remove();
      database.ref('playerPosition/' + user).remove();
      database.ref(user).remove();
    });

    database.ref(`games/${gameId}`).on('value', (players) => {
      if (!players.val().hasOwnProperty('playersInGame')) {
        firebase.database().ref(`games/${gameId}`).remove();
      };
    });
  }

  componentWillUnmount() {
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    database.ref('games/' + gameId + '/playersInGame/' + user).remove();
    database.ref('games/' + gameId + '/playersInGame').off();
    database.ref('games/' + gameId + '/playersInGame/' + user).remove().then(() => {
      database.ref('games/' + gameId).once('value').then(allPlayers => {
        allPlayers = allPlayers.val();
        (!allPlayers.playersInGame) && database.ref('games/' + gameId).remove();
      });
    });
    database.ref(user).remove();
    database.ref(user).off();
    database.ref('playerPosition/' + user).remove();
    database.ref('playerPosition/' + user).off();
    database.ref(`games/${gameId}`).off();
    database.ref('games/' + gameId + '/winPosition').off();
    database.ref('games/' + gameId + '/playersInGame/winner').off();
    audio0.pause();
  }

  createWinPoint(scene) {
    torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene);
    torus.position.x = 10;
    torus.position.z = 10;
  };

  render() {
    return (
      <div>
        <MuteSound />
        <WinScreen user={this.props.user} database={database} />
        <InfoScreen />
        <ScoreTable gameId={this.props.user.gameId} />
        <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
});

const mapDispatch = ({ changeScore });

export default connect(mapStateToProps, mapDispatch)(Game);
