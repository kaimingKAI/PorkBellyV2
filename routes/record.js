const config = require('../config.json')
const fetch = require('node-fetch')
const express = require("express")

const admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");
const { QuerySnapshot, DocumentSnapshot } = require("@google-cloud/firestore");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config['databaseURL']
});

const db = admin.firestore()
const recordRouter = express.Router()

recordRouter.get("/showMovies",(req,res)=>{
    let resultString = ""
    db.collection("movies").get().then((QuerySnapshot)=>{
       QuerySnapshot.forEach(DocumentSnapshot=>{
           dateM = DocumentSnapshot.get('date')
           nameM = DocumentSnapshot.get('name')
           rateM = DocumentSnapshot.get('rate') 
           resultM = dateM + " 看了 " +nameM+"\n 我们说： "+ rateM+"\n-----------------\n\n"
           resultString+=resultM
       })
       res.json({result:resultString})
    })
    
})


module.exports = recordRouter