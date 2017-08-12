window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);
  const createScene = () => {
    const scene = new BABYLON.Scene(engine); // creates a basic Babylon scene object
    scene.enablePhysics();
    scene.collisionsEnabled = true;
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7; // default is 1, so this is slightly dimmed

    // ---- SPHERE ----

    const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene); //Params: name, subdivs, size, scene
    sphere.position.y = 2;

    // ---- GROUND ----

    const ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
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

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 0.01,
      friction: 0.5,
      restitution: 0.7
    }, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 0,
      restitution: 0.9
    }, scene);
    sphere.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));

    // ---- Keys ----

    let zAxis = 0;
    let xAxis = 0;
    let yAxis = 0;

    function moveBall(direction, obj) {
      if(direction === 'left') xAxis += .5;
      if(direction === 'right') xAxis -= .5;
      if(direction === 'up') zAxis += .5;
      if(direction === 'down') zAxis -= .5;
      obj.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(zAxis, 0, xAxis, 0));
    }

    window.onkeydown = e => {
      if (e.key === ' ') {
        sphere.position.y = 4;
      }
      if (e.key === 'ArrowLeft') {
        moveBall('left', sphere)
      }
      if (e.key === 'ArrowRight') {
        moveBall('right', sphere);
      }
      if (e.key === 'ArrowUp') {
        moveBall('up', sphere);
      }
      if (e.key === 'ArrowDown') {
        moveBall('down', sphere);
      }
    }

    // ---- CAMERA ----

    const followCamera = new BABYLON.FollowCamera("followCam", new BABYLON.Vector3(0, 15, -45), scene);
    followCamera.lockedTarget = sphere;
    followCamera.radius = 5; // how far from the object to follow
    followCamera.heightOffset = 7; // how high above the object to place the camera
    followCamera.rotationOffset = 180; // the viewing angle
    followCamera.cameraAcceleration = 0.05 // how fast to move
    followCamera.maxCameraSpeed = 0.7 // speed limit
    followCamera.attachControl(canvas, true);
    scene.activeCamera = followCamera;

    // ---- MATERIAL ----

    const ballMaterial = new BABYLON.StandardMaterial('material', scene);
    const tubeMaterial = new BABYLON.StandardMaterial('material', scene);
    const textureTube = new BABYLON.Texture('stone.png', scene);
    const textureBall = new BABYLON.Texture('net.png', scene);
    ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
    ballMaterial.diffuseTexture = textureBall;
    ballMaterial.diffuseTexture.hasAlpha = true;
    sphere.material = ballMaterial;
    tubeMaterial.diffuseTexture = textureTube;
    tube.material = tubeMaterial;
    const groundMaterial = new BABYLON.StandardMaterial('material', scene);
    const textureGrass = new BABYLON.Texture('grass-large.png', scene);
    groundMaterial.diffuseTexture = textureGrass;
    ground.material = groundMaterial;

    return scene;
  };

  const scene = createScene();
  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});