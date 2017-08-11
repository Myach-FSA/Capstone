import * as firebase from "firebase";
const secret = './secret.js'

const config = {
  apiKey: secret.apiKey,
  authDomain: secret.authDomain,
  databaseURL: secret.databaseURL,
  projectId: secret.projectId,
  storageBucket: secret.storageBucket,
  messagingSenderId: secret.messagingSenderId,
};
firebase.initializeApp(config);

