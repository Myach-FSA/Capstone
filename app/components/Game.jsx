/* global BABYLON */

import React from 'react';
import firebase from '../../fire';
const database = firebase.database();

class Game extends React.Component {

  componentDidMount() {
    let canvas = this.refs.renderCanvas
    let engine = new BABYLON.Engine(canvas, true)
    const scene = createScene(engine, canvas);
    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }
  componentWillUnmount(){
    // database.ref('users').set(null);
  }

  render() {
    return (
      <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      //ref= // takes in callback (canvas)
    )
  }
}

export default Game;

function createPlayerOnConnect(sce, id, color){
  const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); //Params: name, subdivs, size, scene
  player.position.y = 1;
  player.checkCollisions = true;
  var ballMaterial = new BABYLON.StandardMaterial('material', sce);
  ballMaterial.diffuseColor = BABYLON.Color3.Blue();
  player.material = ballMaterial;
  player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
    mass: 0.01,
    friction: 0.5,
    restitution: 0.7
  }, sce);

  return player;
}

function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine); // creates a basic Babylon scene object
  scene.enablePhysics();
  scene.collisionsEnabled = true;
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7; // default is 1, so this is slightly dimmed

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, scene);
  ground.checkCollisions = true;

  // ---- CURVE POINTS ----

  // const curvePoints = (l, t) => {
  //   const path = [];
  //   let step = l / t;
  //   let a = 5;
  //   for (let i = -l / 2; i < l / 2; i += step) {
  //     path.push(new BABYLON.Vector3(5 * Math.sin(i * t / 400), i, 5 * Math.cos(i * t / 400)));
  //   }
  //   return path;
  // };
  // const curve = curvePoints(40, 100);

  // ---- PHYSICS ----
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);
  // sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, {
  //   mass: 0.01,
  //   friction: 0.5,
  //   restitution: 0.7
  // }, scene);

  // ---- Players ---- //

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

    return text;
  }

  // function generatePlayer() {
  // }
  // ---- Keys ----

  let zAxis = 0;
  let xAxis = 0;
  let yAxis = 0;

  var user = createPlayerOnConnect(scene, makeid());

//   function writeUserData(userId, name, email, imageUrl) {
//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }
  console.log(user);

  database.ref('users/' + user.id).set({color: 'blue'});

  const head = BABYLON.MeshBuilder.CreateSphere("1", 1, scene);
  var headMaterial = new BABYLON.StandardMaterial("material", scene);
  var headTexture = new BABYLON.Texture("./assets/textures/net.png", scene);
  headMaterial.diffuseTexture = headTexture;
  headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  headMaterial.diffuseTexture.hasAlpha = true;
  head.position.x = user.position.x;
  head.position.y = 0;
  head.material = headMaterial;
  head.parent = user;

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

  database.ref(user.id).set({ xAxis: 0, zAxis: 0 });

  function gameLoop() {
    if (keyState[37] || keyState[65]) {
      if (xAxis < 5) {
        xAxis += .5;
        database.ref(user.id).set({ xAxis, zAxis });
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAxis > -5) {
        xAxis -= .5;
        database.ref(user.id).set({ xAxis, zAxis });
      }
    }
    if (keyState[38] || keyState[87]) {
      if (zAxis < 5) {
        zAxis += .5;
        database.ref(user.id).set({ xAxis, zAxis });
      }
    }
    if (keyState[40] || keyState[83]) {
      if (zAxis > -5) {
        zAxis -= .5;
        database.ref(user.id).set({ xAxis, zAxis });
      }
    }
    setTimeout(gameLoop, 50);
  }

  database.ref(user.id).on('value', function (val) {
    user.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(val.val().zAxis, 0, val.val().xAxis, 0));
  });

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
  followCamera.lockedTarget = head;

  // ---- MATERIAL ----

  // var ballMaterial = new BABYLON.StandardMaterial('material', scene);
  // // var tubeMaterial = new BABYLON.StandardMaterial('material', scene);
  // // var textureTube = new BABYLON.Texture('./assets/textures/stone.png', scene);
  // var textureBall = new BABYLON.Texture('./assets/textures/net.png', scene);
  // ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  // ballMaterial.diffuseTexture = textureBall;
  // ballMaterial.diffuseTexture.hasAlpha = true;
  // user.material = ballMaterial;
  // tubeMaterial.diffuseTexture = textureTube;
  // sphere2.material = tubeMaterial;
  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureGrass = new BABYLON.Texture('./assets/textures/grass-large.png', scene);
  groundMaterial.diffuseTexture = textureGrass;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
