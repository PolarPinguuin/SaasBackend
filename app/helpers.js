"use strict"
module.exports = {
  responseToJson,
}

function responseToJson(props) {
  console.log(props);
  return function (req, res, next) {
    res.json(req.resources[props])
  }
}
