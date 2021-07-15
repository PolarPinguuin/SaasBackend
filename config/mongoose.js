"use strict"

const mongoose = require('mongoose')

module.exports = {
  initMongoose
}

function initMongoose() {
    mongoose.connect('mongodb://127.0.0.1:27017/aries4', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

  const db = mongoose.connection;

  db.on("error", function (error) {
    console.log(error);
  });

  db.once("open", function () {
    console.log("connected");
  });
}