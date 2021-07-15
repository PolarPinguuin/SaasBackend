"use strict"
const serverHandler = require('./serverHandler')
const fs = require('fs');
const path = require('path');

module.exports = {
  createUser,
  uploadFile,
  getFile
}

let body = {}

function createUser(req, res, next) {
  // console.log(req.body);
  // console.log(req.files);

  body = req.body
  return next()
}

function uploadFile(req,res, next) {
    body = {...body, fileData: req.files.fileData}

   const response = serverHandler.start(body)
  //
  // if (!req.body.name) {
  //   return res.status(400).json({
  //     status: 'error',
  //     error: 'req body cannot be empty',
  //   });
  // }
  const fileData = response.fileData;
  fs.writeFileSync(`${__dirname}/${fileData.fileName}${fileData.extension}`, fileData.fileBuffer);

  return next()
}

function getFile(req, res, next) {
  console.log(__dirname + '/tst.aes');
  const file = fs.readFileSync(__dirname +'/tst.aes');

  res.status(200).send(file);
  return next()
}
