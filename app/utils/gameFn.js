import balls from '../components/balls';

export const createPlayerOnConnect = (sce, id, texture) => {
  const player = BABYLON.Mesh.CreateSphere(id, 16, 2, sce); // Params: name, subdivs, size, scene
  player.checkCollisions = true;
  const ballMaterial = new BABYLON.StandardMaterial('material', sce);
  const ballTexture = new BABYLON.Texture([balls][texture], sce);
  player.material = ballMaterial;
  if (!player.physicsImpostor) {
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 1,
      friction: 0.5,
      restitution: 0.7
    }, sce);
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
