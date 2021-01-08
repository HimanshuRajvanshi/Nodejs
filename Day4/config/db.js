
const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const MONGOURI = "'mongodb://127.0.0.1/apidemo';";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Yo yo Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;