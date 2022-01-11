const express = require('express')
const admin=require('firebase-admin');
const app = express()
const port = 3000

var serviceAccount = require('./admin.json');
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://fir-37e91-default-rtdb.europe-west1.firebasedatabase.app",
authDomain: "fir-37e91.firebaseapp.com",
});

var db=admin.database();
var userRef=db.ref("users");
var receiveddata; //here is the data stored when received.

//Sending data! Adding a json object to the database
function addUser(obj){
  var oneUser=userRef.child(obj.roll);
  oneUser.update(obj,(err)=>{
  if(err){
    console.log("Something went wrong" + err)
  //res2.status(300).json({"msg":"Something went wrong","error":err});
  }
  else{
  //res2.status(200).json({"msg":"user created sucessfully"});
  console.log("user created sucessfully")
  }
  }) }

//Fetching data! fetching a json object from the database
function getUsers(){
  userRef.once('value',function(snap) {
    snap.val();
    receiveddata = {"users":snap.val()};
    console.log(JSON.stringify(receiveddata));
    })
}

//just a homepage
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

//go to this link to send the data
app.get('/send', (req, res) => {
  let user = JSON.parse('{"name":"Tester32", "email":"yolo@yolo", "roll":2000}')
  addUser(user)
  res.send('sending the data. check the console')
})

//go to this link to fetch the data
app.get('/fetch', (req, res) => {
  getUsers();
  res.send('fetching the data. check the console')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})