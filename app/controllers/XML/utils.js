const xmldom = require('xmldom');
const fs = require('fs');
const select = require('xml-crypto').xpath;
const SignedXml = require('xml-crypto').SignedXml;
const FileKeyInfo = require('xml-crypto').FileKeyInfo;

const config = {
    certsPath: '../cert/',
};

exports.reardCertFile = function(fileName) {
    return fs.readFileSync(`${config.certsPath}${fileName}`);
};

exports.readXMLFile = function(fileName) {
    return fs.readFileSync(`${fileName}`).toString();
}

exports.removeHeaders = function(pem) {
    var cert = /-----BEGIN CERTIFICATE-----([^-]*)-----END CERTIFICATE-----/g.exec(pem.toString());
    if (cert.length > 0) {
        // console.log(cert[1].replace(/[\n|\r\n]/g, ''));
      return cert[1].replace(/[\n|\r\n]/g, '');
    }
  
    return null;
  };


