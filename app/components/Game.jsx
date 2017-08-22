/* global BABYLON */

import React, { Component } from 'react';
import firebase from '../../fire';
import createScene1 from './Scene1';
import createScene2 from './Scene2';
import InfoScreen from './InfoScreen';
const auth = firebase.auth();
import ScoreTable from './ScoreTable';
// import Chat from '../../demos/chat'

const database = firebase.database();
const objects = [];
const thisPlayer = '';
const playersInGame = {};
// OB/JL: maybe wrap all this up into an object called babylonState
let sceneNum = 1;
let torus;
let winPos;
let zAcceleration = 0;
let xAcceleration = 0;
const yAcceleration = 0;
const changeScene = (num) => {
  sceneNum = num;
};
let info;

class Game extends Component {
  constructor(props) {
    super(props);
  }

  // OB/JL: split it up! it's too big to not fail!
  componentDidMount() {
    audio0.play();
    const user = this.props.user.userId; // OB/JL: maybe name this userId
    const canvas = this.refs.renderCanvas;
    const engine = new BABYLON.Engine(canvas, true);
    let num = sceneNum;
    let scene = createScene1(canvas, engine);
    database.ref('winPosition').set({ x: 10, z: 10 });
    this.createWinPoint();
    database.ref('winPosition').on('value', (position) => {
      winPos = position.val(); // OB/JL: couldn't this be a setState
    });
    // OB/JL: name this as a function called "generateWinner" or something
    database.ref('players/winner').on('value', (winner) => {
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
        database.ref('users/' + user + '/totalScore').transaction((score) => {
          score += myScore;
          return score;
        });
        this.props.changeScore(-myScore);
        database.ref('players/' + user).update({ 'score': 0 });
        database.ref('players/winner').remove();
      }
    });
    // OB/JL: maybe only listen for child_added
    database.ref('players').on('value', (players) => {
      const playersObj = players.val();
      for (const playerId in playersObj) {
        if (!playersInGame[playerId] || playersInGame.scene) {
          const newPlayer = this.createPlayerOnConnect(scene, playerId);
          if (newPlayer.id === user) {
            this.playerPosition(newPlayer);
            this.setColor(newPlayer, { b: Math.random(), g: Math.random(), r: Math.random() });
            info = { x: newPlayer.position.x, y: newPlayer.position.y, z: newPlayer.position.z, color: newPlayer.material.diffuseColor };
            database.ref('playerPosition/' + newPlayer.id).set(info);
          } else {
            database.ref('playerPosition/' + playerId).on('value', (playerInfo) => {
              if (playerInfo.val()) {
                const x = playerInfo.val().x;
                const y = playerInfo.val().y;
                const z = playerInfo.val().z;
                const color = playerInfo.val().color;
                this.setPosition(newPlayer, x, y, z);
                this.setColor(newPlayer, color);
              }
            });
          }
          // OB/JL: camera stuff could be its own function
          const followCamera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 15, -45), scene);
          if (playerId === user) {
            const playerDummy = this.createCameraObj(scene, newPlayer);
            control(newPlayer);
            followCamera.lockedTarget = playerDummy;
            scene.activeCamera = followCamera;
            followCamera.radius = 15; // how far from the object to follow
            followCamera.heightOffset = 7; // how high above the object to place the camera
            followCamera.rotationOffset = 180; // the viewing angle / 180
            followCamera.cameraAcceleration = 0.05; // how fast to move
            followCamera.maxCameraSpeed = 10; // speed limit / 0.05
            followCamera.attachControl(canvas, true);
          }
          database.ref(newPlayer.id).on('value', (otherPlayer) => {
            if (otherPlayer.val()) {
              newPlayer.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(otherPlayer.val().zAcceleration, 0, otherPlayer.val().xAcceleration, 0));
            }
          });
          objects.push(newPlayer);
          playersInGame[playerId] = true;
        }
      }
      // OB/JL: put this into a child_removed (?) listener
      for (let i = 0; i < objects.length; i++) {
        if (playersObj[objects[i].id].remove) {
          objects[i].dispose();
        }
      }
    });
    database.ref('players/' + user).set({ 'created': true, 'score': 0, 'remove': false });
    // OB/JL: consider putting bablyon stuff into its own module and here, you'd just do e.g. `babylonEngine.init(canvasElement)`
    engine.runRenderLoop(() => {
      if ((torus.position.x !== winPos.x) || (torus.position.z !== winPos.z)) {
        torus.position.x = winPos.x;
        torus.position.z = winPos.z;
      }
      if (!scene || (sceneNum !== num)) {
        num = sceneNum;
        switch (num) {
          case 2:
            scene = createScene2(canvas, engine);
            break;
          default: scene = createScene1(canvas, engine);
        }
        setTimeout(scene.render(), 500);
        playersInGame.scene = true;
        database.ref('players/' + user).push({ id: 'test' });
        playersInGame.scene = false;
      } else {
        const me = objects.filter(player => player.id === user)[0];
        if (me && me.absolutePosition.y < -100) {
          this.playerPosition(me);
          database.ref(user).set({ 'xAcceleration': 0, 'zAcceleration': 0 });
          me.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          xAcceleration = 0;
          zAcceleration = 0;
          database.ref('players/' + user + '/score').transaction((score) => {
            this.props.changeScore(-1);
            score -= 1;
            return score;
          });
        }
        if (me && (Math.floor(me.absolutePosition.x) === winPos.x) && (Math.floor(me.absolutePosition.z) === winPos.z)) {
          database.ref('players/' + user + '/score').transaction((score) => {
            this.props.changeScore(1);
            score += 1;
            if (score >= 10) {
              database.ref('/players').update({ 'winner': user });
              score = 0;
            }
            return score;
          });
          const x = Math.floor(Math.random() * 50 - 25);
          const z = Math.floor(Math.random() * 50 - 25);
          database.ref('winPosition').set({ 'x': x, 'z': z });
        }
        scene.render();
      }
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
    window.addEventListener('beforeunload', () => {
      database.ref('players/' + user).update({ remove: true });
      database.ref('players/' + user).remove();
      database.ref('playerPosition/' + user).remove();
      database.ref(user).remove();
    });
  }

  componentWillUnmount() {
    const user = this.props.user.userId;
    database.ref('players/' + user).remove();
    database.ref('playerPosition/' + user).remove();
    database.ref(user).remove();
    audio0.pause();
    // OB/JL: don't forget to clean up all your listeners
    // OB/JL: shouldn't this stop the engine?
  }

  createPlayerOnConnect(sce, id) {
    const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); // Params: name, subdivs, size, scene
    player.checkCollisions = true;
    const ballMaterial = new BABYLON.StandardMaterial('material', sce);
    player.material = ballMaterial;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 1,
      friction: 0.5,
      restitution: 0.7
    }, sce);
    return player;
  }

  // OB/JL: nicecly wrapped up
  setPosition(sphere, x, y, z) {
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
  }

  setColor(sphere, color) {
    sphere.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
  }

  playerPosition(player) {
    function randomPosition(min) {
      return Math.floor(Math.random() * min - min / 2);
    }
    player.position.y = 4;
    player.position.x = randomPosition(45);
    player.position.z = randomPosition(45);
  }

  createCameraObj(scene, par) {
    const head = BABYLON.MeshBuilder.CreateSphere('camera', 16, scene);
    const headMaterial = new BABYLON.StandardMaterial('material', scene);
    const headTexture = new BABYLON.Texture('./assets/textures/net.png', scene);
    headMaterial.diffuseTexture = headTexture;
    headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
    headMaterial.diffuseTexture.hasAlpha = true;
    head.material = headMaterial;
    head.parent = par;
    return head;
  }
  createWinPoint(scene) {
    torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene);
    torus.position.x = 10;
    torus.position.z = 10;
  }
  // OB/JL: dead code
  makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  render() {
    return (
      <div>
        <InfoScreen />
        <ScoreTable />
        <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      </div>
    );
  }
}

function control(user) {
  const keyState = {};

  window.onkeydown = function (e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      document.getElementById('ScoreTable').className = 'scoreTable visible has-text-centered';
      document.getElementById('InfoScreen').className = 'infoScreen invisible has-text-centered';
    }
  };

  window.onkeyup = function (e) {
    if (e.keyCode === 9) {
      document.getElementById('ScoreTable').className = 'scoreTable invisible has-text-centered';
      document.getElementById('InfoScreen').className = 'infoScreen visible has-text-centered';
    }
  };

  window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, true);
  window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

  database.ref(user.id).set({ xAcceleration: 0, zAcceleration: 0 });

  function gameLoop() {
    database.ref('playerPosition/' + user.id).set({ color: info.color, x: user.position.x, y: user.position.y, z: user.position.z });
    if (keyState[37] || keyState[65]) {
      if (xAcceleration < 5) {
        xAcceleration += 0.5;
        database.ref(user.id).set({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAcceleration > -5) {
        xAcceleration -= 0.5;
        database.ref(user.id).set({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[38] || keyState[87]) {
      if (zAcceleration < 5) {
        zAcceleration += 0.5;
        database.ref(user.id).set({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[40] || keyState[83]) {
      if (zAcceleration > -5) {
        zAcceleration -= 0.5;
        database.ref(user.id).set({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[32]) {
      var forceVector = new BABYLON.Vector3(0, 10, 0);
      if (user.position.y < 1.1) {
        user.applyImpulse(forceVector, user.position);
      }
      database.ref(user.id).set({ xAcceleration, zAcceleration });
    }
    setTimeout(gameLoop, 50);
  }
  gameLoop();
}

// /* -----------------    CONTAINER     ------------------ */

import { changeScore } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
});

const mapDispatch = ({ changeScore });

export default connect(mapStateToProps, mapDispatch)(Game);

// /* -----------------    CONTAINER     ------------------ */

export { changeScene };
