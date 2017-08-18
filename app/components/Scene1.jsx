import React from 'react'
import game, {createScene, getScene} from '../reducers'
import createScene2 from './Scene2'
import {changeScene} from './Game'

/* global BABYLON */
const createScene1 = (canvas, engine) => {
  var sceneval=game.action
  const scene = new BABYLON.Scene(engine) // creates a basic Babylon scene object
  scene.enablePhysics()
  scene.collisionsEnabled = true
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7 // default is 1, so this is slightly dimmed

  var background = new BABYLON.Layer("back", "./assets/textures/green_black_cubes.jpg", scene);
	background.isBackground = true;
	background.texture.level = 0;
	background.texture.wAng = .2;

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene)
  ground.checkCollisions = true
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene)

  // ---- CAMERA ----

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  // ---- MATERIAL ----

  var ballMaterial = new BABYLON.StandardMaterial('material', scene)
  var tubeMaterial = new BABYLON.StandardMaterial('material', scene)
  var textureTube = new BABYLON.Texture('./assets/textures/stone.png', scene)
  var textureBall = new BABYLON.Texture('./assets/textures/net.png', scene)
  ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7)
  ballMaterial.diffuseTexture = textureBall
  ballMaterial.diffuseTexture.hasAlpha = true
  tubeMaterial.diffuseTexture = textureTube
  tubeMaterial.diffuseTexture.hasAlpha = true
  var groundMaterial = new BABYLON.StandardMaterial('material', scene)
  // var textureGrass = new BABYLON.Texture('./assets/textures/chuttersnap.jpg', scene)
  // groundMaterial.diffuseTexture = textureGrass
  const groundColor = new BABYLON.Color3(0, 1, 0);
  groundColor.hasAlpha = true;
  groundMaterial.alpha = 0.6;
  groundMaterial.diffuseColor = groundColor;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
export default createScene1;
