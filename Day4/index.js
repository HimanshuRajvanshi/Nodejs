const express = require('express');
const bodyParser = require('body-parser');
const exjwt = require('express-jwt');
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user"); //new addition

// Instantiating the express app
const app = express();
// Initiate Mongo Server
InitiateMongoServer();

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api", user);

 // Starting the app on PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Boom port ${PORT}`);
});