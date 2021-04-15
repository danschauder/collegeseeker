const functions = require("firebase-functions");

exports.randomNumber = functions.https.onRequest((request, response)=>{
  const number = Math.round(Math.random()*100);
  response.send(number.toString());
});

// const admin = require('firebase-admin');
// admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sayHello = functions.https.onCall((data, context)=>{
  return `hello there`;
});
