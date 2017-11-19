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

const db = firebase.database();

class Game extends Component {
  constructor(props) {
    super(props);
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
    const scene = createScene1(canvas, this.engine);
    const torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene);

    gameUtils.setWinPoint(gameId);

    db.ref(`games/${gameId}/playersInGame`).on('child_added', async (player) => {
      const playerInfo = player.val();
      let texture = await db.ref(`users/${playerInfo.id}/ball`).once('value');
      texture = texture.val();
      const playerMesh = gameUtils.createPlayerOnConnect(scene, playerInfo.id, texture);

      gameUtils.setTexture(playerMesh, texture, scene);
      if (playerMesh.id === user) {
        const cameraDummy = gameUtils.createCameraObj(scene, playerMesh);
        gameUtils.playerPosition(playerMesh);
        gameUtils.followCameraView(scene, cameraDummy, canvas);
        control(playerMesh, gameId);
        await db.ref(`${gameId}/${playerMesh.id}`).set({
          x: playerMesh.position.x,
          y: playerMesh.position.y,
          z: playerMesh.position.z,
          xAcceleration: 0,
          zAcceleration: 0,
        });
      }

      db.ref(`${gameId}/${playerMesh.id}`).on('value', (player) => {
        if (player.val()) {
          const coords = player.val();
          gameUtils.setPosition(playerMesh, coords.x, coords.y, coords.z);
          playerMesh.physicsImpostor.setAngularVelocity(
            new BABYLON.Quaternion(player.val().zAcceleration, 0, player.val().xAcceleration, 0));
        }
      });
    });

    db.ref(`games/${gameId}/playersInGame`).on('child_removed', (player) => {
      db.ref(`${gameId}/${player.val().id}`).off();
      scene.getMeshByID(player.val().id).dispose();
    });

    db.ref(`games/${gameId}/winPosition`).on('value', (position) => {
      this.scored = false;
      if (position.val()) {
        torus.position.x = position.val().x;
        torus.position.z = position.val().z;
        this.winPos = position.val();
      }
    });

    db.ref(`games/${gameId}/playersInGame/winner`).on('value', (winner) => {
      if (winner.val()) {
        if (user === winner.val()) {
          db.ref(`users/${user}/wins`).transaction(wins => wins += 1);
        } else {
          db.ref(`users/${user}/losses`).transaction(losses => losses += 1);
        }
        const myScore = this.props.user.totalScore;
        this.props.changeScore(-myScore);
        db.ref(`games/${gameId}/playersInGame/${user}`).update({ 'score': 0 });
        db.ref(`games/${gameId}/playersInGame/winner`).remove();
      }
    });

    this.engine.runRenderLoop(() => {
      const userMesh = scene.getMeshByID(user);
      if (userMesh && userMesh.absolutePosition.y < -25) {
        db.ref(`${gameId}/${user}`).update({ 'xAcceleration': 0, 'zAcceleration': 0 });
        gameUtils.playerPosition(userMesh);
        userMesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        this.props.changeScore(-1);
        db.ref(`users/${user}/totalScore`).transaction(score => score -= 1);
        db.ref(`games/${gameId}/playersInGame/${user}/score`).transaction((score) => score -= 1);
      }
      if (this.winPos && !this.scored) {
        if ((Math.floor(userMesh.absolutePosition.x) === this.winPos.x) && (Math.floor(userMesh.absolutePosition.z) === this.winPos.z)) {
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
      db.ref(`games/${gameId}/playersInGame/${user}`).remove();
      db.ref(`${gameId}/${user}`).remove();
    });
  }

  componentWillUnmount() {
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    window.removeEventListener('resize', () => { this.engine.resize(); });
    window.removeEventListener('beforeunload', () => {
      db.ref(`games/${gameId}/playersInGame/${user}`).remove();
      db.ref(`${gameId}/${user}`).remove();
    });
    this.engine.stopRenderLoop();
    db.ref(`games/${gameId}/playersInGame`).off();
    db.ref(`games/${gameId}/winPosition`).off();
    db.ref(`games/${gameId}/playersInGame/winner`).off();
    db.ref(`${gameId}`).once('value').then(players => {
      const playersArr = Object.keys(players.val());
      for (const player of playersArr) {
        db.ref(`${gameId}/${player}`).off();
      }
      db.ref(`${gameId}/${user}`).remove();
    });
    db.ref(`games/${gameId}/playersInGame/${user}`).remove();
    db.ref(`games/${gameId}`).once('value').then(allPlayers => {
      allPlayers = allPlayers.val();
      if (!allPlayers.playersInGame) db.ref(`games/${gameId}`).remove();
    });
    audio0.pause();
  }

  render() {
    return (
      <div>
        <MuteSound />
        <WinScreen user={this.props.user} database={db} />
        <InfoScreen />
        <ScoreTable gameId={this.props.user.gameId} />
        <canvas className='gameDisplay' ref="renderCanvas"></canvas>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
});

const mapDispatch = ({ changeScore });

export default connect(mapStateToProps, mapDispatch)(Game);
