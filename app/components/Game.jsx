/* global BABYLON */

import React, { Component } from 'react';
import firebase from '../../fire';
import createScene1 from './Scene1';
import createScene2 from './Scene2';
import InfoScreen from './InfoScreen';
const auth = firebase.auth();
import ScoreTable from './ScoreTable';
import WinScreen from './WinScreen';

const database = firebase.database();
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
    this.state = {
      playersInGame: [],
      objects: [],
    };
  }

  componentDidMount() {
    database.ref('event').set('placeholder');
    audio0.play();
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    const canvas = this.refs.renderCanvas;
    const engine = new BABYLON.Engine(canvas, true);
    let num = sceneNum;
    let scene = createScene1(canvas, engine);

    database.ref('games/' + gameId + '/playersInGame').on('value', (players) => {
      const playersObj = players.val();
      for (const playerId in playersObj) {
        console.log('playersIngame', this.state.playersInGame)
        console.log('playersObj', playersObj);
        if (!this.state.playersInGame.includes(playerId) && playersObj[playerId].create) {
          console.log('1', playersObj[user]);
          const newPlayer = this.createPlayerOnConnect(scene, playerId);
          if (newPlayer.id === user) {
            this.playerPosition(newPlayer);
            // this.setColor(newPlayer, { b: Math.random(), g: Math.random(), r: Math.random() });
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
                // this.setColor(newPlayer, color);
              }
            });
          }
          const newState = this.state.objects.slice();
          const newPlayersState = this.state.playersInGame.slice();
          newState.push(newPlayer);
          newPlayersState.push(playerId);
          this.setState({ objects: newState });
          this.setState({ playersInGame: newPlayersState });
          console.log('playersIngame after push', this.state.playersInGame);
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
          console.log(newPlayer.id);
          database.ref(newPlayer.id).on('value', (otherPlayer) => {
            if (otherPlayer.val()) {
              console.log(otherPlayer.val());
              newPlayer.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(otherPlayer.val().zAcceleration, 0, otherPlayer.val().xAcceleration, 0));
            }
          });
        }
      }
      for (let i = 0; i < this.state.objects.length; i++) {
        if (playersObj[this.state.playersInGame[i]]) {
          if (playersObj[this.state.playersInGame[i]].remove) {
            console.log(playersObj[this.state.playersInGame[i]]);
            this.state.objects[i].dispose();
            this.state.objects[i].physicsImpostor.dispose();
            const newState = this.state.playersInGame.filter(player => { return player !== this.state.objects[i].id; });
            this.setState({ playersInGame: newState });
            this.setState({ objects: this.state.objects.filter((_, j) => { return j !== this.state.objects.indexOf(this.state.objects[i]); }) });
          }
        }
        console.log(this.state.playersInGame);
        console.log(this.state.objects);
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
        database.ref('users/' + user + '/totalScore').transaction((score) => {
          score += myScore;
          return score;
        });
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
      if (!scene || (sceneNum !== num)) {
        num = sceneNum;
        switch (num) {
          case 2:
            scene = createScene2(canvas, engine);
            break;
          default: scene = createScene1(canvas, engine);
        }
        setTimeout(scene.render(), 500);
      } else {
        const me = this.state.objects.filter(player => player.id === user)[0];
        // if (me) {
        //   database.ref('playerPosition/' + me.id).set({ color: 'black', x: me.position.x, y: me.position.y, z: me.position.z });
        // }
        if (me && me.absolutePosition.y < -100) {
          this.playerPosition(me);
          database.ref(user).set({ 'xAcceleration': 0, 'zAcceleration': 0 });
          me.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          xAcceleration = 0;
          zAcceleration = 0;
          database.ref('games/' + gameId + '/playersInGame/' + user + '/score').transaction((score) => {
            this.props.changeScore(-1);
            score -= 1;
            return score;
          });
        }
        if (winPos) {
          if (me && (Math.floor(me.absolutePosition.x) === winPos.x) && (Math.floor(me.absolutePosition.z) === winPos.z)) {
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
      }
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
    window.addEventListener('beforeunload', () => {
      database.ref('games/' + gameId + '/playersInGame/' + user).update({ remove: true });
      //Need to find a way to call promises to remove one user and check for remainder before removing parent node
      database.ref('games/' + gameId).remove();
      database.ref('playerPosition/' + user).remove();
      database.ref(user).remove();
    });
  }

  componentWillUnmount() {
    const user = this.props.user.userId;
    const gameId = this.props.user.gameId;
    for (let i = 0; i < this.state.playersInGame.length; i++) {
      console.log(this.state.playersInGame[i]);
      database.ref('playerPosition/' + this.state.playersInGame[i]).off();
    }
    database.ref('games/' + gameId + '/playersInGame/' + user).update({ remove: true }).then(() => {
      database.ref('playerPosition/' + user).remove();
    });
    database.ref('games/' + gameId + '/playersInGame/' + user).remove().then(() => {
      database.ref('games/' + gameId).once('value').then(allPlayers => {
        allPlayers = allPlayers.val();
        if (!allPlayers.playersInGame) {
          database.ref('games/' + gameId).remove();
        }
      });
    });
    database.ref('games/' + gameId + '/playersInGame').off();
    database.ref('playerPosition').off();
    database.ref('playerPosition/' + user).off();
    database.ref(user).off();
    database.ref('playerPosition/' + user).remove();
    database.ref(user).remove();
    database.ref(this.props.user.userId).off();
    audio0.pause();
  }

  createPlayerOnConnect(sce, id) {
    const balls = ['/assets/textures/students/stone.png', '/assets/textures/students/net.png', '/assets/textures/students/alvin.png', '/assets/textures/students/andrew.png',
      '/assets/textures/students/denys.png', '/assets/textures/students/evan.png', '/assets/textures/students/snow.png', '/assets/textures/students/won_jun.png',
      '/assets/textures/students/grass-large.png'
    ];
    const ballId = this.props.user.ball;
    const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); // Params: name, subdivs, size, scene
    player.checkCollisions = true;
    const ballMaterial = new BABYLON.StandardMaterial('material', sce);
    const ballTexture = new BABYLON.Texture(`${balls[ballId]}`, sce);
    ballMaterial.diffuseTexture = ballTexture;
    player.material = ballMaterial;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 1,
      friction: 0.5,
      restitution: 0.7
    }, sce);
    return player;
  }

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
    player.position.y = 2;
    player.position.x = randomPosition(45);
    player.position.z = randomPosition(45);
  }

  createCameraObj(scene, par) {
    const head = BABYLON.MeshBuilder.CreateSphere('camera', 16, scene);
    const headMaterial = new BABYLON.StandardMaterial('material', scene);
    const headTexture = new BABYLON.Texture('/assets/textures/net.png', scene);
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

  render() {
    return (
      <div>
        <WinScreen user={this.props.user} database={database} />
        <InfoScreen />
        <ScoreTable gameId={this.props.user.gameId} />
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
