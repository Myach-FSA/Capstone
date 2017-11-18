import React, { Component } from 'react';
import firebase from '../../fire';
const database = firebase.database();

const Control = (user, gameId) => {
  const keyState = {};
  let zAcceleration = 0;
  let xAcceleration = 0;

  window.onkeydown = function(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      document.getElementById('ScoreTable').className = 'scoreTable visible has-text-centered';
      document.getElementById('InfoScreen').className = 'infoScreen invisible has-text-centered';
    }
  };

  window.onkeyup = function(e) {
    if (e.keyCode === 9) {
      document.getElementById('ScoreTable').className = 'scoreTable invisible has-text-centered';
      document.getElementById('InfoScreen').className = 'infoScreen visible has-text-centered';
    }
  };

  window.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, true);
  window.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

  database.ref(`${gameId}/${user.id}`).update({ xAcceleration: 0, zAcceleration: 0 });

  function gameLoop() {
    database.ref(`${gameId}/${user.id}`).update({ x: user.position.x, y: user.position.y, z: user.position.z });
    if (keyState[37] || keyState[65]) {
      if (xAcceleration < 5) {
        xAcceleration += 0.5;
        database.ref(`${gameId}/${user.id}`).update({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[39] || keyState[68]) {
      if (xAcceleration > -5) {
        xAcceleration -= 0.5;
        database.ref(`${gameId}/${user.id}`).update({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[38] || keyState[87]) {
      if (zAcceleration < 5) {
        zAcceleration += 0.5;
        database.ref(`${gameId}/${user.id}`).update({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[40] || keyState[83]) {
      if (zAcceleration > -5) {
        zAcceleration -= 0.5;
        database.ref(`${gameId}/${user.id}`).update({ xAcceleration, zAcceleration });
      }
    }
    if (keyState[32]) {
      const forceVector = new BABYLON.Vector3(0, 10, 0);
      if (user.position.y < 1.1) {
        user.applyImpulse(forceVector, user.position);
      }
      database.ref(`${gameId}/${user.id}`).update({ xAcceleration, zAcceleration });
    }
  }
  const gameInterval = setInterval(gameLoop, 49);

  // Need to clearinterval otherwise player position is always being sent
  database.ref(`/games/${gameId}/playersInGame`).on('value', (players) => {
    if (!players.val() || !players.val().hasOwnProperty(user.id)) {
      clearInterval(gameInterval);
      window.onkeydown = null;
      window.onkeyup = null;
      database.ref(`/games/${gameId}/playersInGame`).off();
    }
  });
};

export default Control;
