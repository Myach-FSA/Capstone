/* global BABYLON */

import React, { Component } from 'react';
import firebase from '../../fire';
import createScene1 from './Scene1';
import createScene2 from './Scene2';

const database = firebase.database();
var objects = [];
var thisPlayer = '';
var playersInGame = {};
var executed = false;
let sceneNum = 1;
const changeScene = (num) => {
  sceneNum=num;
};

class Game extends Component {
  componentDidMount() {
    const canvas = this.refs.renderCanvas;
    const engine = new BABYLON.Engine(canvas, true);
    let num = sceneNum;
    let scene = createScene1(canvas, engine);
    const user = this.makeId();
    database.ref('players').on('value', (players) => {
      console.log('db change')
      var playersObj = players.val();
      for (let player in playersObj) {
        if (!playersInGame[player] || playersInGame.scene) {
          var newPlayer = this.createPlayerOnConnect(scene, player, null);
          const followCamera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 15, -45), scene);
          if (!executed) {
            const playerDummy = this.createCameraObj(scene, newPlayer);
            executed = true;
            // followCamera.lockedTarget = playerDummy;
            // scene.activeCamera = followCamera;
            followCamera.radius = 15; // how far from the object to follow
            followCamera.heightOffset = 7; // how high above the object to place the camera
            followCamera.rotationOffset = 180; // the viewing angle / 180
            followCamera.cameraAcceleration = 0.05; // how fast to move
            followCamera.maxCameraSpeed = 10; // speed limit / 0.05
            followCamera.attachControl(canvas, true);
          }
          database.ref(newPlayer.id).on('value', (val) => {
            newPlayer.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(val.val().zAxis, 0, val.val().xAxis, 0));
          });
          objects.push(newPlayer);
          playersInGame[player] = true;
        }
      }
    });
    database.ref('players/' + user).set({ id: user });

    engine.runRenderLoop(() => {
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
        scene.render();
      }
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  componentWillUnmount() {
    database.ref('players/' + thisPlayer).set(null);
  }

  createPlayerOnConnect(sce, id, color) {
    const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); // Params: name, subdivs, size, scene
    function randomPosition(min) {
      return Math.floor(Math.random() * min - min / 2);
    }
    player.position.y = 1;
    player.position.x = randomPosition(50);
    player.position.z = randomPosition(50);
    player.checkCollisions = true;
    var ballMaterial = new BABYLON.StandardMaterial('material', sce);
    ballMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    player.material = ballMaterial;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 0.01,
      friction: 0.5,
      // restitution: 0.1
    }, sce);
    return player;
  }

  createCameraObj(scene, par) {
    const head = BABYLON.MeshBuilder.CreateSphere('camera', 16, scene);
    var headMaterial = new BABYLON.StandardMaterial('material', scene);
    var headTexture = new BABYLON.Texture('./assets/textures/net.png', scene);
    headMaterial.diffuseTexture = headTexture;
    headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
    headMaterial.diffuseTexture.hasAlpha = true;
    head.material = headMaterial;
    head.parent = par;
    return head;
  }

  makeId() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  render() {
    return (
      <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      // ref= // takes in callback (canvas)
    );
  }
}

function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine); // creates a basic Babylon scene object
  scene.enablePhysics();
  scene.collisionsEnabled = true;
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7; // default is 1, so this is slightly dimmed

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene);
  ground.checkCollisions = true;

  // ---- PHYSICS ----
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);

  // ---- Players ---- //

  function makeId() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // ---- Keys ----

  let zAxis = 0;
  let xAxis = 0;
  const yAxis = 0;

  var user = makeId();

  database.ref('players/' + user).set({ id: user });

  const keyState = {};

  window.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, true);
  window.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

  database.ref(user).set({ xAxis: 0, zAxis: 0 });

  function gameLoop() {
    if (keyState[37] || keyState[65]) {
      if (xAxis < 5) {
        xAxis += 0.5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAxis > -5) {
        xAxis -= 0.5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[38] || keyState[87]) {
      if (zAxis < 5) {
        zAxis += 0.5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[40] || keyState[83]) {
      if (zAxis > -5) {
        zAxis -= 0.5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    setTimeout(gameLoop, 50);
  }

  gameLoop();

  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  // ---- MATERIAL ----

  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureGrass = new BABYLON.Texture('./assets/textures/grass-large.png', scene);
  groundMaterial.diffuseTexture = textureGrass;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----
  return scene;
}
export default Game;

export { changeScene };
