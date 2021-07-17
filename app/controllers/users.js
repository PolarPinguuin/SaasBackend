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
   console.log("Body primit ca JSON:", req.body);
  // console.log(req.files);

    body = req.body
    //body.keysData.certificate = (new Buffer.from(body.keysData.certificate, 'base64')).toString('utf8').replace(/(?:\r\n|\r|\n)/g, '');
    if (body.keysData.certificate) {
        body.keysData.certificate = (new Buffer.from(body.keysData.certificate, 'base64')).toString('utf8').replace(/\\n/gm, '\n');
        body.keysData.publicKey = body.keysData.certificate;
    }
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
    //body.keysData.privateKey = req.files.keysData ? Buffer.from(req.files.keysData.data).toString().replace(/(?:\r\n|\r|\n)/g, '') : null;
    console.log("Private key", req.files);
    if (req.files.keysData) {
        body.keysData.privateKey = req.files.keysData ? Buffer.from(req.files.keysData.data).toString().replace(/\\n/gm, '\n').replace(/\r/gm, '') : null;
    }

    body = { ...body, fileData, signatureData }

    console.log("Body Construit dupa", body);

    //console.log("aici ", body);
    const response = serverHandler.start(body)

    if (response.hasError) {
        res.status(500).send("eroare");
        return;
    }

    // After response
    fileDataResponse = response.fileData;
    console.log("File path,", getFilePath(fileDataResponse));
    fs.writeFileSync(getFilePath(fileDataResponse), fileDataResponse.fileBuffer);
    console.log("Ajunge aici 3", response)

    let sendResponse = {
        filedata: {
            fileExtension: fileDataResponse.extension,
            fileName: fileDataResponse.fileName
        }
    }

    if (response.isSignedValid !== null) {
        sendResponse.isSignedValid = response.isSignedValid;
    }

    if (response.signatureData) {
        signatureDataResponse = response.signatureData;
        //console.log("aici semnatura", signatureDataResponse);
        fs.writeFileSync(getFilePath(signatureDataResponse), signatureDataResponse.fileBuffer);
        console.log("Signature path,", getFilePath(signatureDataResponse));

        sendResponse.signatureData = {
                fileExtension: signatureDataResponse.extension,
                fileName: signatureDataResponse.fileName
        }
    }

    console.log("send response", sendResponse);

    res.send(JSON.stringify(sendResponse));
  //return next()
}

function getFilePath(file) {
    return `${__dirname}\\${file.fileName}${file.extension}`;
}

function getFile(req, res, next) {
    const fileRequested = req.body;
    console.log("file requested,", fileRequested);
    let file = null;


    if (fileRequested.fileName === "fileData") {
         file = fs.readFileSync(getFilePath(fileDataResponse));
         console.log("File send", getFilePath(fileDataResponse));
    //file = fs.readFileSync(`${__dirname}\\1.jpg`);
    } else if (fileRequested.fileName === "fileSignature") {
         file = fs.readFileSync(getFilePath(signatureDataResponse));
         console.log("File send", getFilePath(signatureDataResponse));
     }
    
    //console.log("file base64", Buffer.from(file).toString('base64'));

    res.status(200).send(Buffer.from(file).toString('base64'));
  return next()
}

function processFileData(file) {
    const extensions = file.name.split('.');
    const extension = extensions.length < 3 ? `.${file.name.split('.').pop()}` : `.${file.name.split('.')[1]}.${file.name.split('.')[2]}`;
    const isXmlFile = extension.includes(".xml");
    console.log("Fisier xml", extension, isXmlFile);

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

