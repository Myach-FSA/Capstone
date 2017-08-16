/* global BABYLON */

import React from 'react';
import firebase from '../../fire';
const database = firebase.database();
var IDs = [];
var objects = [];
var playersInGame = {};
class Game extends React.Component {

  componentDidMount() {
    let canvas = this.refs.renderCanvas
    let engine = new BABYLON.Engine(canvas, true)
    const scene = createScene(engine, canvas);

    database.ref('players').on('value', (players) => {
      var playersObj = players.val();
      var playerPosition = 4;
      for (let player in playersObj) {
        if (!playersInGame[player]) {
          var newPlayer = this.createPlayerOnConnect(scene, player, null, playerPosition);
          this.createCamera(scene, newPlayer )
          database.ref(newPlayer.id).on('value', (val) => {
            newPlayer.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(val.val().zAxis, 0, val.val().xAxis, 0));
          });
          objects.push(newPlayer)
          playerPosition += 2;
          playersInGame[player] = true;
        }
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  createPlayerOnConnect(sce, id, color, pos) {
    const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); //Params: name, subdivs, size, scene
    player.position.y = 1;
    player.position.z = pos;
    player.checkCollisions = true;
    var ballMaterial = new BABYLON.StandardMaterial('material', sce);
    ballMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    player.material = ballMaterial;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 0.01,
      friction: 0.5,
      restitution: 0.7
    }, sce);
    return player;
  }

  createCamera(scene, par) {
    const head = BABYLON.MeshBuilder.CreateSphere("1", 1, scene);
    var headMaterial = new BABYLON.StandardMaterial("material", scene);
    var headTexture = new BABYLON.Texture("./assets/textures/net.png", scene);
    headMaterial.diffuseTexture = headTexture;
    headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
    headMaterial.diffuseTexture.hasAlpha = true;
    head.position.x = par.position.x;
    head.position.y = 0;
    head.material = headMaterial;
    head.parent = par;
  }

  render() {
    return (
      <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      //ref= // takes in callback (canvas)
    )
  }
}

export default Game;

function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine); // creates a basic Babylon scene object
  scene.enablePhysics();
  scene.collisionsEnabled = true;
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7; // default is 1, so this is slightly dimmed

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, scene);
  ground.checkCollisions = true;

  // ---- PHYSICS ----
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);

  // ---- Players ---- //

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
    { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

    return text;
  }

  // ---- Keys ----

  let zAxis = 0;
  let xAxis = 0;
  let yAxis = 0;

  var user = makeid();

  database.ref('players/' + user).set({ id: user });

  // const head = BABYLON.MeshBuilder.CreateSphere("1", 1, scene);
  // var headMaterial = new BABYLON.StandardMaterial("material", scene);
  // var headTexture = new BABYLON.Texture("./assets/textures/net.png", scene);
  // headMaterial.diffuseTexture = headTexture;
  // headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  // headMaterial.diffuseTexture.hasAlpha = true;
  // head.position.x = objects[user].position.x;
  // head.position.y = 0;
  // head.material = headMaterial;
  // head.parent = objects[user];

  const keyState = {};

  window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, true);
  window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

  database.ref(user).set({ xAxis: 0, zAxis: 0 });

  function gameLoop() {
    if (keyState[37] || keyState[65]) {
      if (xAxis < 5) {
        xAxis += .5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAxis > -5) {
        xAxis -= .5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[38] || keyState[87]) {
      if (zAxis < 5) {
        zAxis += .5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    if (keyState[40] || keyState[83]) {
      if (zAxis > -5) {
        zAxis -= .5;
        database.ref(user).set({ xAxis, zAxis });
      }
    }
    setTimeout(gameLoop, 50);
  }

  gameLoop();

  // ---- CAMERA ----

  const followCamera = new BABYLON.FollowCamera("followCam", new BABYLON.Vector3(0, 15, -45), scene);
  followCamera.radius = 10; // how far from the object to follow
  followCamera.heightOffset = 7; // how high above the object to place the camera
  followCamera.rotationOffset = 180; // the viewing angle / 180
  followCamera.cameraAcceleration = 0.05 // how fast to move
  followCamera.maxCameraSpeed = 10; // speed limit / 0.05
  followCamera.attachControl(canvas, true);
  scene.activeCamera = followCamera;
  followCamera.lockedTarget = ground;

  // ---- MATERIAL ----

  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureGrass = new BABYLON.Texture('./assets/textures/grass-large.png', scene);
  groundMaterial.diffuseTexture = textureGrass;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
