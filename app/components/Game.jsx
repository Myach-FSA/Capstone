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

  render() {
    return (
      <canvas ref="renderCanvas" width={window.innerWidth} height={window.innerHeight * 0.8}></canvas>
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

  // ---- SHAPES ----

  const sphere1 = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene); //Params: name, subdivs, size, scene
  sphere1.position.y = 1;
  sphere1.checkCollisions = true;

  var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 32, 2, scene);
  sphere2.position.y = 4;
  sphere2.position.x = 4;
  sphere2.checkCollisions = true;

  const head = BABYLON.MeshBuilder.CreateSphere("1", 1, scene);
  var headMaterial = new BABYLON.StandardMaterial("material", scene);
  var headTexture = new BABYLON.Texture("./assets/textures/net.png", scene);
  headMaterial.diffuseTexture = headTexture;
  headMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  headMaterial.diffuseTexture.hasAlpha = true;
  head.position.x = sphere1.position.x;
  head.position.y = 0;
  head.material = headMaterial;

  head.parent = sphere1;

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, scene);
  ground.checkCollisions = true;

  // ---- CURVE POINTS ----

  const curvePoints = (l, t) => {
    const path = [];
    let step = l / t;
    let a = 5;
    for (let i = -l / 2; i < l / 2; i += step) {
      path.push(new BABYLON.Vector3(5 * Math.sin(i * t / 400), i, 5 * Math.cos(i * t / 400)));
    }
    return path;
  };
  const curve = curvePoints(40, 100);

  // ---- PHYSICS ----

  sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, {
    mass: 0.01,
    friction: 0.5,
    restitution: 0.7
  }, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);
  sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, {
    mass: 0.01,
    friction: 0.5,
    restitution: 0.7
  }, scene);

  // ---- Keys ----

  let zAxis = 0;
  let xAxis = 0;
  let yAxis = 0;

  const keyState = {};

  window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
  }, true);
  window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

  function gameLoop() {
    if (keyState[37] || keyState[65]) {
      if (xAxis < 5) {
        xAxis += .5;
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAxis > -5) {
        xAxis -= .5;
      }
    }
    if (keyState[38] || keyState[87]) {
      if (yAxis < 5) {
        yAxis += .5;
      }
    }
    if (keyState[40] || keyState[83]) {
      if (yAxis > -5) {
        yAxis -= .5;
      }
    }
    sphere1.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(yAxis, 0, xAxis, 0));
    database.ref("user1").set(sphere1.position);
    database.ref("user2").set(sphere2.position);
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
  followCamera.lockedTarget = head;

  // ---- MATERIAL ----

  var ballMaterial = new BABYLON.StandardMaterial('material', scene);
  var tubeMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureTube = new BABYLON.Texture('./assets/textures/stone.png', scene);
  var textureBall = new BABYLON.Texture('./assets/textures/net.png', scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  ballMaterial.diffuseTexture = textureBall;
  ballMaterial.diffuseTexture.hasAlpha = true;
  sphere1.material = ballMaterial;
  tubeMaterial.diffuseTexture = textureTube;
  sphere2.material = tubeMaterial;
  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureGrass = new BABYLON.Texture('./assets/textures/grass-large.png', scene);
  groundMaterial.diffuseTexture = textureGrass;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
