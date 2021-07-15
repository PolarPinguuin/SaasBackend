"use strict"

module.exports = {
  errorHandling
}

function errorHandling(app) {
  app.use(function (err, req, res, next) {
    return res.status(err.statusCode || 400).json({
      status: 'error',
      message: err && err.message || 'Default error message'
    })
  })
}
