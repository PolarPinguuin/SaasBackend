"use strict"
const serverHandler = require('./serverHandler')
const fs = require('fs');
const path = require('path');

module.exports = {
  createUser,
  uploadFile,
    getFile,
}

let body = {}

function createUser(req, res, next) {
  // console.log(req.body);
  // console.log(req.files);

    body = req.body
    body.keysData.certificate = (new Buffer.from(body.keysData.certificate, 'base64')).toString('utf8').replace(/(?:\r\n|\r|\n)/g, '');
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
    body.keysData.privateKey = req.files.keysData ? Buffer.from(req.files.keysData.data).toString().replace(/(?:\r\n|\r|\n)/g, '') : null;

    body = { ...body, fileData, signatureData }

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

    res.send(JSON.stringify({ fileExtension: fileDataResponse.extension, fileName: fileDataResponse.fileName }));
  //return next()
}

function getFilePath(file) {
    return `${__dirname}\\${file.fileName}${file.extension}`;
}

function getFile(req, res, next) {
    const fileRequested = req.body;
    let file = null;

    // if (fileRequested.name === "fileData") {
        file = fs.readFileSync(getFilePath(fileDataResponse));
    //file = fs.readFileSync(`${__dirname}\\1.jpg`);
    // } else if (fileRequested.name === "fileSignature") {
    //     file = fs.readFileSync(getFilePath(signatureDataResponse));
    // }
    //console.log("file send", file);
    //console.log("file base64", Buffer.from(file).toString('base64'));

    res.status(200).send(Buffer.from(file).toString('base64'));
  return next()
}

function processFileData(file) {
    const extensions = file.name.split('.');
    const extension = extensions.length < 3 ? `.${file.name.split('.').pop()}` : `.${file.name.split('.')[1]}.${file.name.split('.')[2]}`;
    const isXmlFile = extension === ".xml";
    return {
        fileBuffer: file.data,
        fileName: file.name.split('.').shift(),
        extension,
        fileString: null,
        isXmlFile
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

