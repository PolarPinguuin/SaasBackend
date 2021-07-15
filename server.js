"use strict"
const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express();
const { PORT } = require('./config/index');
app.use(cors())
app.use(fileUpload())

//init configs
require('./config/express').initExpress(app)
require('./config/routes').initRoutes(app)

require('./config/finalRoute').finalRoute(app)
require('./config/errorHandling').errorHandling(app)

app.listen(PORT, function () {
  console.log(`app is running ${PORT}`);
})
