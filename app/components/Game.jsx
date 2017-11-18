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
import {incrementScoreBy} from '../utils/scoreFn';

const database = firebase.database();
let zAcceleration = 0;
let xAcceleration = 0;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersInGame: [],
      objects: [],
      info: {},
    };
    this.engine;
    this.winPos;
    this.scored = false;
  }
  componentDidMount() {
    audio0.play();
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    const canvas = this.refs.renderCanvas;
    this.engine = new BABYLON.Engine(canvas, true);
    let texture;
    const scene = createScene1(canvas, this.engine);
    const torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene);
    gameUtils.setWinPoint(gameId);

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
          this.setState({ objects: newState, playersInGame: newPlayersState });
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

    database.ref('games/' + gameId + '/winPosition').on('value', (position) => {
      this.scored = false;
      if (position.val()) {
        torus.position.x= position.val().x;
        torus.position.z= position.val().z;
        this.winPos = position.val();
      }
    });

    database.ref('games/' + gameId + '/playersInGame/winner').on('value', (winner) => {
      if (winner.val()) {
        if (user === winner.val()) {
          database.ref('users/' + user + '/wins').transaction((wins) => wins += 1);
        } else {
          database.ref('users/' + user + '/losses').transaction((losses) => losses += 1);
        }

        const myScore = this.props.user.totalScore;
        this.props.changeScore(-myScore);
        database.ref('games/' + gameId + '/playersInGame/' + user).update({ 'score': 0 });
        database.ref('games/' + gameId + '/playersInGame/winner').remove();
      }
    });

    this.engine.runRenderLoop(() => {
      const me = this.state.objects.filter(player => player.id === user)[0];
      if (me && me.absolutePosition.y < -25) {
        while (me.position.y < 0) {
          gameUtils.playerPosition(me);
        }
        database.ref(user).set({ 'xAcceleration': 0, 'zAcceleration': 0 });
        me.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        xAcceleration = 0;
        zAcceleration = 0;
        database.ref('users/' + user + '/totalScore').transaction(score => score -= 1);
        database.ref('games/' + gameId + '/playersInGame/' + user + '/score').transaction((score) => {
          this.props.changeScore(-1);
          return score -= 1;
        });
      }
      if (this.winPos && !this.scored) {
        if (me && (Math.floor(me.absolutePosition.x) === this.winPos.x) && (Math.floor(me.absolutePosition.z) === this.winPos.z)) {
          this.scored = true;
          this.props.changeScore(1);
          gameUtils.setWinPoint(gameId);
          incrementScoreBy(1, gameId, user);
        }
      }
      scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
    window.addEventListener('beforeunload', () => {
      database.ref('games/' + gameId + '/playersInGame/' + user).remove();
      database.ref('playerPosition/' + user).remove();
      database.ref(user).remove();
    });
  }

  componentWillUnmount() {
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    window.removeEventListener('resize', () => { this.engine.resize(); });
    this.engine.stopRenderLoop();
    database.ref('games/' + gameId + '/playersInGame/' + user).remove().then(() => {
      database.ref('games/' + gameId).once('value').then(allPlayers => {
        allPlayers = allPlayers.val();
        (!allPlayers.playersInGame) && database.ref('games/' + gameId).remove();
      });
    });
    database.ref('games/' + gameId + '/playersInGame').off();
    database.ref(user).remove();
    database.ref(user).off();
    database.ref('playerPosition/' + user).remove();
    database.ref('playerPosition/' + user).off();
    database.ref('games/' + gameId + '/winPosition').off();
    database.ref('games/' + gameId + '/playersInGame/winner').off();
    audio0.pause();
  }

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
