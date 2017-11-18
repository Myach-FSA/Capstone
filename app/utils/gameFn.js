import balls from '../components/balls';

export const createPlayerOnConnect = (scene, id, texture) => {
  const player = BABYLON.Mesh.CreateSphere(id, 16, 2, scene); // Params: name, subdivs, size, scene
  player.checkCollisions = true;
  const ballMaterial = new BABYLON.StandardMaterial('material', scene);
  const ballTexture = new BABYLON.Texture([balls][texture], scene);
  player.material = ballMaterial;
  if (!player.physicsImpostor) {
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 1,
      friction: 0.5,
      restitution: 0.7
    }, scene);
  }
  return player;
};

export const setPosition = (sphere, x, y, z) => {
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
};

export const setTexture = (sphere, texture, scene) => {
  sphere.material.diffuseTexture = new BABYLON.Texture(balls[texture - 1].img, scene);
};

export const playerPosition = (player) => {
  const randomPosition = (min) => Math.floor(Math.random() * min - min / 2);
  player.position.y = 5;
  player.position.x = randomPosition(40);
  player.position.z = randomPosition(40);
};

export const createCameraObj = (scene, par) => {
  const head = BABYLON.MeshBuilder.CreateSphere('camera', 16, scene);
  head.parent = par;
  return head;
};

export const followCameraView = (scene, playerDummy, canvas) => {
  const followCamera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 15, -45), scene);
  scene.activeCamera = followCamera;
  followCamera.lockedTarget = playerDummy;
  followCamera.radius = 15; // how far from the object to follow
  followCamera.heightOffset = 7; // how high above the object to place the camera
  followCamera.rotationOffset = 180; // the viewing angle / 180
  followCamera.cameraAcceleration = 0.05; // how fast to move
  followCamera.maxCameraSpeed = 10; // speed limit / 0.05
  followCamera.attachControl(canvas, true);
};

export const setWinPoint = (gameId) => {
  const x = Math.floor(Math.random() * 50 - 25);
  const z = Math.floor(Math.random() * 50 - 25);
  firebase.database().ref(`games/${gameId}/winPosition`).set({x, z});
};
