import React from 'react'

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

  // updateCanvasSize() {
  //   var w = window,
  //       d = document,
  //       documentElement = d.documentElement,
  //       body = d.getElementsByTagName('body')[0],
  //       width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
  //       height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

  //   this.setState({ width, height});
  // }

  // componentWillMount() {
  //   this.updateCanvasSize();
  // }

  render() {
    return (
      <canvas ref="renderCanvas" width="1300px" height="600px"></canvas>
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

  const head = BABYLON.MeshBuilder.CreateBox("box", 1, scene);
  head.position.x = sphere1.position.x;
  head.position.y = 0;

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

    setTimeout(gameLoop, 50);
  }
  gameLoop();

  // ---- CAMERA ----

  // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 20, -40), scene);
  // camera.setTarget(BABYLON.Vector3.Zero());
  // camera.attachControl(canvas, false);

  const followCamera = new BABYLON.FollowCamera("followCam", new BABYLON.Vector3(0, 15, -45), scene);
  followCamera.radius = 10; // how far from the object to follow
  followCamera.heightOffset = 7; // how high above the object to place the camera
  followCamera.rotationOffset = 180; // the viewing angle / 180
  followCamera.cameraAcceleration = 0.05 // how fast to move
  followCamera.maxCameraSpeed = 10; // speed limit / 0.05
  followCamera.attachControl(canvas, true);
  scene.activeCamera = followCamera;
  followCamera.lockedTarget = head;


  // camera
  //var camera = new BABYLON.TargetCamera("targetCam", BABYLON.Vector3.Zero(), scene);
  // var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
  // camera.setPosition(new BABYLON.Vector3(0, 50, -200));
  // camera.attachControl(canvas, true);

  // Follow Cam
  // var followCam = new BABYLON.FollowCamera("fcam", new BABYLON.Vector3(0, 15, -45), scene);
  // followCam.setTarget = sphere1;
  // followCam.radius = 10;

  // scene.activeCamera = followCam;


  // var targetCam = new BABYLON.TargetCamera("tcam", new BABYLON.Vector3(0, 15, -45), scene);
  // targetCam.setTarget(sphere1.position);
  // scene.activeCamera = targetCam;
  // var target = BABYLON.Vector3.Zero();

  // ---- MATERIAL ----

  var ballMaterial = new BABYLON.StandardMaterial('material', scene);
  var tubeMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureTube = new BABYLON.Texture('stone.png', scene);
  var textureBall = new BABYLON.Texture('net.png', scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(2.0, 1, 0.7);
  ballMaterial.diffuseTexture = textureBall;
  ballMaterial.diffuseTexture.hasAlpha = true;
  sphere1.material = ballMaterial;
  tubeMaterial.diffuseTexture = textureTube;
  sphere2.material = tubeMaterial;
  var groundMaterial = new BABYLON.StandardMaterial('material', scene);
  var textureGrass = new BABYLON.Texture('grass-large.png', scene);
  groundMaterial.diffuseTexture = textureGrass;
  ground.material = groundMaterial;

  // ---- RETURN SCENE ----

  return scene;
};
