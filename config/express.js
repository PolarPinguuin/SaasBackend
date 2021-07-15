"use strict"

const bodyParser = require('body-parser');
const methodOverride = require('method-override')

module.exports = {
  initExpress
}

function initExpress(app) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use( function(req, res, next) {
    req.resources = req.resources || {};
    next()
  })
}
