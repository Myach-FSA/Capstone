import React from 'react';
import * as firebase from "firebase";
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var config = {
  apiKey: "AIzaSyD9X0omDWFjc474Br6nAQfcNwBvB4ZhQ98",
  authDomain: "capstone-466c2.firebaseapp.com",
  databaseURL: "https://capstone-466c2.firebaseio.com",
  projectId: "capstone-466c2",
  storageBucket: "capstone-466c2.appspot.com",
  messagingSenderId: "1073805838813"
};
firebase.initializeApp(config);
