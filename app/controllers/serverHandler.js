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
  //reqObj.fileData.fileBuffer = reqObj.fileData.data
    let signatureData = null;
    if (reqObj.signatureData) {
        signatureData = {
            fileBuffer: reqObj.signatureData.fileBuffer,
            fileString: reqObj.signatureData.fileString,
            extension: reqObj.signatureData.extension,
            fileName: reqObj.signatureData.fileName,
        };
    }

  const hasBuffer = !!(reqObj.fileData.fileBuffer);

  const fileObj = {
    fileData : {
      fileBuffer: hasBuffer ? Buffer.from(reqObj.fileData.fileBuffer) : null,
      fileName: reqObj.fileData.fileName,
      extension: reqObj.fileData.extension,
      fileString: reqObj.fileData.fileString,
      xmlSigType: reqObj.fileData.xmlSigType
      },

    signatureData,

    fileBufferChanged: false,
    isSigned:       false,
    isSignedValid:  null,
    hasError: false,
  }
   // console.log("qw3eqw", fileObj);

  for(let service of reqObj.services) {
      if (service) {
          if (service === "apply") {
              service = reqObj.isXmlFile ? 'sigxml' : 'sigfile'
          } else if (service === "verify") {
              service = reqObj.isXmlFile ? 'sigxmlcheck' : 'sigfilecheck'
          }
      servicesFunctionsObj(service, reqObj, fileObj);
    }
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

