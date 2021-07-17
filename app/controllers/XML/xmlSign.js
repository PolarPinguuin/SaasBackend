const SignedXml = require('xml-crypto').SignedXml;
const utils = require('./utils');

const config = {
  certsPath: '../cert/',
  reference: '/*',
  outputFileName: 'signed.xml'
};

const algorithms = {
  signature: {
    'rsa-sha256': 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    'rsa-sha1':  'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
  },
  digest: {
    'sha256': 'http://www.w3.org/2001/04/xmlenc#sha256',
    'sha1': 'http://www.w3.org/2000/09/xmldsig#sha1'
  }
};

exports.create = function(file, cert, privatekey, type = 'enveloped') {
  const xmlString = file;
    cert = utils.removeHeaders(cert);



  const signedXML = new SignedXml(null, { signatureAlgorithm: algorithms.signature['rsa-sha256'], idAttribute: 'AssertionID' });
  signedXML.keyInfoProvider = {
    getKeyInfo: function () {
      return "<X509Data><X509Certificate>" + cert + "</X509Certificate></X509Data>";
    }
  };
  
  // Cheia privata
  signedXML.signingKey = privatekey;

  if (type === "enveloped") {
    signedXML.addReference(config.reference, ["http://www.w3.org/2000/09/xmldsig#enveloped-signature","http://www.w3.org/2001/10/xml-exc-c14n#"], algorithms.digest['sha256']);
    signedXML.computeSignature(xmlString);
  } else if ( type === "detached") {
    signedXML.addReference(config.reference, ["http://www.w3.org/2001/10/xml-exc-c14n#"], algorithms.digest['sha256']);
    signedXML.computeSignature(xmlString, {location:{reference: '/',action: "prepend"} }); // Detached
  }

  // fs.writeFileSync(config.outputFileName, signedXML.getSignedXml())
  console.log("Xml creat");
  
  return signedXML.getSignedXml();
}
