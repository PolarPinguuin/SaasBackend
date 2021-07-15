const fs = require("fs");
const rsaService = require("./RSA/rsa");
const aesECBService = require('./AES/aesECB');
const aesCBCService = require('./AES/aesCBC');
const signatureService = require("./RSA/signature");
const xmlSignService = require('./XML/xmlSign');
const xmlCheckService = require('./XML/xmlCheck');

// Encription
const ENCRIPTION = new Set([
    "rsa.en",
    "aesecb.en",
    "aescbc.en",
]);

// Decription
const DECRIPTION = new Set([
  "rsa.de",
  "aesecb.de",
  "aescbc.de"
])

// Signatures
const SIGNATURES = new Set([
  "sigfile",
  "sigxml",
]);

const CHECKERS = new Set([
  "sigfilecheck",
  "sigxmlcheck"
]);

function servicesFunctionsObj(service, reqObj, file) {
  console.log(service);
  switch(service.toLowerCase()) {
    case 'rsa.en':
      rsaService.rsaEncrypt(reqObj, file);
      file.fileBufferChanged = true;
      break;
    case 'rsa.de':
      rsaService.rsaDecrypt(reqObj, file)
      file.fileBufferChanged = true;
      file.fileBufferChanged = true;
      break;
    case 'aesecb.en':
      aesECBService.encryptFile(reqObj, file)
      file.fileBufferChanged = true;
      break;
    case 'aesecb.de':
      aesECBService.decryptFile(reqObj, file)
      file.fileBufferChanged = true;
      break;
    case 'aescbc.en':
      aesCBCService.encryptFile(reqObj, file)
      file.fileBufferChanged = true;
      break;
    case 'aescbc.de':
      aesCBCService.decryptFile(reqObj, file)
      file.fileBufferChanged = true;
      break;
    case 'sigxml':
      file.signatureData.signature = xmlSignService.create(file.fileData.fileString, reqObj.keysData.certificate,
                                                               reqObj.keysData.privateKey, reqObj.signatureData.xmlSigType);
      file.isSigned = true;
      file.signatureData.extension = file.fileData.extension;
      file.signatureData.fileName = file.fileData.fileName;
      break;
    case 'sigxmlcheck':
      file.isSignedValid = xmlCheckService.checkSignature(file.fileData.fileString, reqObj.keysData.certificate);
      break;
    case 'sigfile':
      signatureService.createSignature(file, reqObj.keysData.privateKey);
      file.isSigned = true;
      break;
    case 'sigfilecheck':
      file.isSignedValid = signatureService.checkSignature(file, reqObj.keysData.publicKey);
      break;
    default:
      console.log("Invalid Parameter");
      break;
  }
}
exports.start = function(reqObj) {
  reqObj.fileData.fileBuffer = reqObj.fileData.data

  reqObj.keysData.certificate = reqObj.keysData.certificate ? Buffer.from(reqObj.keysData.certificate.data).toString() : null;
  reqObj.keysData.privateKey  = reqObj.keysData.privateKey ? Buffer.from(reqObj.keysData.privateKey.data).toString() : null;
  reqObj.keysData.publicKey   = reqObj.keysData.publicKey ? Buffer.from(reqObj.keysData.publicKey.data).toString() : null;

  const hasBuffer = !!(reqObj.fileData.data);

  const fileObj = {
    fileData : {
      fileBuffer: hasBuffer ? Buffer.from(reqObj.fileData.data) : null,
      fileName: reqObj.fileData.name.split('.').shift(),
      extension: `.${reqObj.fileData.name.split('.').pop()}`,
      fileString: reqObj.fileData.fileString,
      xmlSigType: reqObj.fileData.xmlSigType
    },
    fileBufferChanged: false,
    isSigned:       false,
    isSignedValid:  null,
    hasError: false,
  }
  console.log("qw3eqw");

  for(const service of reqObj.services) {
    servicesFunctionsObj(service, reqObj, fileObj);
  }

  // if(fileObj.hasErrorToDecrypt) {
  //   return {
  //     hasErrorToDecrypt: fileObj.hasErrorToDecrypt
  //   }
  // }

  // if(CHECKERS.has(reqObj.services[0])) {
  //   return {
  //     isSignedCheck: fileObj.isSignedCheck,
  //     isSignedXmlCheck: fileObj.isSignedXmlCheck,
  //   };
  // }

  // if(reqObj.services[0] === "sigfile") {
  //   return {
  //     signatureData: {
  //       fileBuffer: fileObj.signatureData.signature,
  //       extension: fileObj.signatureData.extension,
  //       fileName: fileObj.signatureData.fileName,
  //       signature: fileObj.signatureData.signature,
  //     },
  //     // signnature: fileObj.signature
  //   }
  // }
  return fileObj;
}

