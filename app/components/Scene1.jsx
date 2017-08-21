import React from 'react';
import game, {createScene, getScene} from '../reducers';
import createScene2 from './Scene2';
import {changeScene} from './Game';

/* global BABYLON */
const createScene1 = (canvas, engine) => {
  var sceneval = game.action;
  const scene = new BABYLON.Scene(engine); // creates a basic Babylon scene object
  scene.enablePhysics();
  scene.collisionsEnabled = true;
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7; // default is 1, so this is slightly dimmed

  // var spotLight1 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(-20, 30,
  // -20), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene); spotLight1.diffuse = new
  // BABYLON.Color3(0, 0, 0); spotLight1.specular = new BABYLON.Color3(1, 1, 1);
  var light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 10, 0), scene);
  var light1 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(0, -10, 0), scene);
  var light2 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(10, 0, 0), scene);

  var lightSphere0 = BABYLON
    .Mesh
    .CreateSphere("Sphere0", 16, 0.5, scene);
  var lightSphere1 = BABYLON
    .Mesh
    .CreateSphere("Sphere1", 16, 0.5, scene);
  var lightSphere2 = BABYLON
    .Mesh
    .CreateSphere("Sphere2", 16, 0.5, scene);

  lightSphere0.material = new BABYLON.StandardMaterial("red", scene);
  lightSphere0.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  lightSphere0.material.specularColor = new BABYLON.Color3(0, 0, 0);
  lightSphere0.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

  lightSphere1.material = new BABYLON.StandardMaterial("green", scene);
  lightSphere1.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  lightSphere1.material.specularColor = new BABYLON.Color3(0, 0, 0);
  lightSphere1.material.emissiveColor = new BABYLON.Color3(0, 1, 0);

  lightSphere2.material = new BABYLON.StandardMaterial("blue", scene);
  lightSphere2.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  lightSphere2.material.specularColor = new BABYLON.Color3(0, 0, 0);
  lightSphere2.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

  light0.diffuse = new BABYLON.Color3(0, 0, 0);
  light0.specular = new BABYLON.Color3(0, 1, 0.5);

  light1.diffuse = new BABYLON.Color3(0, 0, 0);
  light1.specular = new BABYLON.Color3(0, 1, 0.5);

  light2.diffuse = new BABYLON.Color3(0, 0, 0);
  light2.specular = new BABYLON.Color3(0, 1, 0.5);

  var alpha = 0;
  scene.beforeRender = function() {
    light0.position = new BABYLON.Vector3(20 * Math.sin(alpha), 15, 20 * Math.cos(alpha));
    light1.position = new BABYLON.Vector3(20 * Math.sin(alpha), 15, -20 * Math.cos(alpha));
    light2.position = new BABYLON.Vector3(20 * Math.cos(alpha), 15, 20 * Math.sin(alpha));

    lightSphere0.position = light0.position;
    lightSphere1.position = light1.position;
    lightSphere2.position = light2.position;

    alpha += 0.03;
  };

  var background = new BABYLON.Layer('back', './assets/textures/green_black_cubes.jpg', scene);
  background.isBackground = true;
  background.texture.level = 0;
  background.texture.wAng = 0.2;

  // var torus = BABYLON.Mesh.CreateTorus('torus', 2, 0.5, 10, scene);
  // torus.position.x=winPos.x; torus.position.z=winPos.z; ---- GROUND ----

  const ground = BABYLON
    .Mesh
    .CreateGround('ground1', 50, 50, 2, scene);
  ground.checkCollisions = true;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);

  // ---- CAMERA ----

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  // ---- MATERIAL ----

  var ballMaterial = new BABYLON.StandardMaterial('material', scene);
  var tubeMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureTube = new BABYLON.Texture('./assets/textures/stone.png', scene);
  var textureBall = new BABYLON.Texture('./assets/textures/net.png', scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  ballMaterial.diffuseTexture = textureBall;
  ballMaterial.diffuseTexture.hasAlpha = true;
  tubeMaterial.diffuseTexture = textureTube;
  tubeMaterial.diffuseTexture.hasAlpha = true;
  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureNet = new BABYLON.Texture('./assets/textures/net.jpg', scene);
  groundMaterial.diffuseTexture = textureNet;
  const groundColor = new BABYLON.Color3(0, 1, 0);
  groundColor.hasAlpha = true;
  groundMaterial.alpha = 0.9;
  groundMaterial.diffuseColor = groundColor;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
export default createScene1;
