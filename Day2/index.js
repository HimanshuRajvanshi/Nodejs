var express = require('express')
var app = express();
var User = require('./User');
var db = require("./myurl").myurl;
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");





var port = process.env.PORT || 3000;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


mongoose
  .connect(db)
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });



app.get('/',(req,res)=>{
   res.status(200).send(`Hi Welcome to the Login and Signup API`);
});
app.listen(port,()=>{
   console.log(`Server is listening on port ${port}`)
});

app.post("/signup", async (req, res) => {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
  
    await User.findOne({ name: newUser.name })
      .then(async profile => {
        if (!profile) {
          await newUser
            .save()
            .then(() => {
              res.status(200).send(newUser);
            })
            .catch(err => {
              console.log("Error is ", err.message);
            });
        } else {
          res.send("User already exists...");
        }
      })
      .catch(err => {
        console.log("Error is", err.message);
      });
  });


  app.post("/login", async (req, res) => {
    var newUser = {};
    newUser.name = req.body.name;
    newUser.password = req.body.password;
    const name=req.body.name;


    await User.findOne({ name: newUser.name })
      .then(profile => {
        if (!profile) {
          res.send("User not exist");
        } else {
          if (profile.password == newUser.password) {
            res.send("User authenticated");
          } else {
            res.send("User Unauthorized Access");
          }
        }
      })
      .catch(err => {
        console.log("Error is ", err.message);
      });
  });
