import admin from 'firebase-admin';
// import serviceAccount from './taskmanagerappfirebsae.json'; 

import serviceAccount from '../config/taskmanagerappfirebsae.json' assert { type: 'json' };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
