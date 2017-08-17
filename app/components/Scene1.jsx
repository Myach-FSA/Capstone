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

  // ---- SHAPES ----

  // let sphere1 = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene) // Params: name, subdivs, size, scene
  // sphere1.position.y = 3
  // sphere1.position.x= 4
  // sphere1.checkCollisions = true

  // const head = BABYLON.Mesh.CreateSphere('sphere3', 1, 1, scene)
  // head.position.x = 0
  // head.position.y = 0

  // head.parent = sphere1

  // const torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene)
  // torus.position.z = -19
  // torus.position.x = -10

  // ---- BACKGROUND ----

  var background = new BABYLON.Layer("back", "./assets/textures/3dcubes.jpg", scene);
	background.isBackground = true;
	background.texture.level = 0;
	background.texture.wAng = .2;

  // ---- GROUND ----

  const ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene)
  ground.checkCollisions = true

  // ---- CURVE POINTS ----

  // const curvePoints = (l, t) => {
  //   const path = []
  //   const step = l / t
  //   const a = 5
  //   for (let i = -l / 2; i < l / 2; i += step) {
  //     path.push(new BABYLON.Vector3(5 * Math.sin(i * t / 400), i, 5 * Math.cos(i * t / 400)))
  //   }
  //   return path
  // }
  // const curve = curvePoints(40, 100)

  // ---- PHYSICS ----

  // sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, {
  //   mass: 0.01,
  //   friction: 0.5,
  //   restitution: 0.7
  // }, scene)
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
  // sphere1.material = ballMaterial
  tubeMaterial.diffuseTexture = textureTube
  tubeMaterial.diffuseTexture.hasAlpha = true
  // torus.material = tubeMaterial
  var groundMaterial = new BABYLON.StandardMaterial('material', scene)
  var textureGrass = new BABYLON.Texture('./assets/textures/chuttersnap.jpg', scene)
  groundMaterial.diffuseTexture = textureGrass
  ground.material = groundMaterial

  // ---- RETURN SCENE ----

  return scene
}
export default createScene1
