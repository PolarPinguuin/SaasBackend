const crypto = require("crypto");

exports.createSignature = function(file, key) {
	const data = file.fileData.fileBuffer;
	const privateKey = crypto.createPrivateKey({
		key: key,
		format: 'pem'
	});

	const signature = crypto.sign("sha256", Buffer.from(data), {
		key: privateKey,
		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
	})
	
	console.log(signature.toString("base64"))
	console.log(signature);

	console.log("Aici ajunge");

	file.signatureData.fileBuffer = signature;
	file.signatureData.fileName = 	file.fileData.fileName;
	file.signatureData.extension = `${file.fileData.extension}.sig`;

	console.log("Semnatura creata");

	return true;
}


exports.checkSignature = function(file, key) {
	const data = file.fileData.fileBuffer;
	const publicKey = crypto.createPublicKey({
		key: key,
		format: 'pem'
	});
	
	// signature = signature.toString("base64");
	const signature = Buffer.from(file.signatureData.fileBuffer);
	const isVerified = crypto.verify(
		"sha256",
		Buffer.from(data),
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
		},
		signature
	)
	
	return isVerified;
}