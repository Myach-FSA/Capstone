// import React from 'react'
// import {changeScene} from './Game'

// /* global BABYLON */
// const createScene2=(canvas, engine) => {
//   const scene = new BABYLON.Scene(engine) // creates a basic Babylon scene object
//   scene.enablePhysics()
//   scene.collisionsEnabled = true
//   const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
//   light.intensity = 0.7 // default is 1, so this is slightly dimmed

//    // ---- BACKGROUND ----

//    var background = new BABYLON.Layer("back", "./assets/textures/bluefog.jpg", scene);
//    background.isBackground = true;
//    background.texture.level = 0;
//    background.texture.wAng = .2;

//     // ---- GROUND ----

//   const ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene)
//   ground.checkCollisions = true

//     // ---- PHYSICS ----

//   ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
//     mass: 0,
//     restitution: 0.9
//   }, scene)

//     // ---- CAMERA ----

//   const followCamera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 15, -45), scene)
//   followCamera.radius = 10 // how far from the object to follow
//   followCamera.heightOffset = 7 // how high above the object to place the camera
//   followCamera.rotationOffset = 180 // the viewing angle / 180
//   followCamera.cameraAcceleration = 0.05 // how fast to move
//   followCamera.maxCameraSpeed = 10 // speed limit / 0.05
//   followCamera.attachControl(canvas, true)
//   scene.activeCamera = followCamera
//   followCamera.lockedTarget = head

//     // ---- MATERIAL ----

//   var ballMaterial = new BABYLON.StandardMaterial('material', scene)
//   var tubeMaterial = new BABYLON.StandardMaterial('material', scene)
//   var textureTube = new BABYLON.Texture('woodpt.png', scene)
//   var textureBall = new BABYLON.Texture('marblept.png', scene)
//   ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7)
//   ballMaterial.diffuseTexture = textureBall
//   ballMaterial.diffuseTexture.hasAlpha = true
//   tubeMaterial.diffuseTexture = textureTube
//   tubeMaterial.diffuseTexture.hasAlpha = true
//   var groundMaterial = new BABYLON.StandardMaterial('material', scene)
//   var textureGrass = new BABYLON.Texture('albedo.png', scene)
//   groundMaterial.diffuseTexture = textureGrass
//   ground.material = groundMaterial

//     // ---- RETURN SCENE ----

//   return scene
// }
// export default createScene2
