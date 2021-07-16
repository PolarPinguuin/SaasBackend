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

let fileDataResponse = null;
let signatureDataResponse = null;

function uploadFile(req, res, next) {
    let fileData = null;
    let signatureData = null;
    let keysData = null;


    fileData = req.files.fileData ? processFileData(req.files.fileData) : null;
    signatureData = req.files.signatureData ? processSignatureData(req.files.signatureData) : null;
    //keysData = req.files.keysData ? proces(req.files.keysData) : null;


    body = { ...body, fileData, signatureData, keysData }
    console.log("aici ", body);
    const response = serverHandler.start(body)

    // After response
    fileDataResponse = response.fileData;
    console.log("File path,", getFilePath(fileDataResponse));
    fs.writeFileSync(getFilePath(fileDataResponse), fileDataResponse.fileBuffer);

    if (response.signatureData) {
        signatureDataResponse = response.signatureData;
        fs.writeFileSync(getFilePath(signatureDataResponse), signatureDataResponse.fileBuffer);
    }

  return next()
}

function getFilePath(file) {
    return `${__dirname}\\${file.fileName}${file.extension}`;
}

function getFile(req, res, next) {
    const fileRequested = req.body;
    let file = null;

    if (fileRequested.name === "fileData") {
        file = fs.readFileSync(getFilePath(fileDataResponse));
    } else if (fileRequested.name === "fileSignature") {
        file = fs.readFileSync(getFilePath(signatureDataResponse));
    }

    const fileData = {
        fileBuffer: file,
        fileExtension: fileDataResponse.extension,
    }

  res.status(200).send(file);
  return next()
}

function processFileData(file) {
    const extension = `.${file.name.split('.').pop()}`;
    const xmlSigType = extension === ".xml";
    return {
        fileBuffer: file.data,
        fileName: file.name.split('.').shift(),
        extension,
        fileString: null,
        xmlSigType
    }
}

function processSignatureData(file) {
    let extension = `.${file.name.split('.')[1]}`;
    extension += `.${file.name.split('.')[2]}`;

    return {
        fileBuffer: file.data,
        fileName: file.name.split('.')[0],
        extension,
        fileString: null,
    }
}

