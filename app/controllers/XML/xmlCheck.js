const utils = require('./utils');
const xmldom = require('xmldom');
const select = require('xml-crypto').xpath;
const SignedXml = require('xml-crypto').SignedXml;
const FileKeyInfo = require('xml-crypto').FileKeyInfo;


isValidSignature = function(xmlFile, cert) {
    const doc = new xmldom.DOMParser().parseFromString(xmlFile);
    // const signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
    // const signature = select(doc, "/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]; //Detached -> Same dock
    const signature = select(doc, "//*[local-name(.)='Signature']")[0]; // ZEU
    const sig = new SignedXml();

    sig.keyInfoProvider = {
      getKeyInfo: function (key) {
        return "<X509Data></X509Data>";
      },
      getKey: function (keyInfo) {
        return cert;
      }
    };

    sig.loadSignature(signature);
    const isValid = sig.checkSignature(xmlFile);
    if (!isValid) {
        console.log(sig.validationErrors);
    }
    return isValid;
};

exports.checkSignature = function(xmlFile, cert) {
	const isValid = isValidSignature(xmlFile, cert);
	if (isValid) {
		console.log("Semnatura e valida");
		return true;
	}
	console.log("Semnatura nu e valida");
	return false;
}
