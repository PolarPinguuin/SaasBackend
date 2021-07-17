const crypto = require("crypto");


exports.rsaEncrypt = function(reqObj, fileObj) {
	let publicKey;

	if(reqObj.keysData.publicKey) {
		publicKey = crypto.createPublicKey({
			key: reqObj.keysData.publicKey,
			format: 'pem'
		});
	}

	const data = fileObj.fileData.fileBuffer;
	console.log("File data (1):", fileObj.fileData.fileBuffer);
	const encryptedData = crypto.publicEncrypt(
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		Buffer.from(data)
	)
	console.log("File data encrypted (RSA): ", encryptedData.toString("base64"));
	console.log("---------------------------");

	fileObj.fileData.fileBuffer = encryptedData;
	fileObj.fileData.extension = `${fileObj.fileData.extension}.enc`;
}

exports.rsaDecrypt = function(reqObj, fileObj) {
	let privateKey;
	if (reqObj.keysData.privateKey) {
		privateKey = crypto.createPrivateKey({
			key: reqObj.keysData.privateKey,
			format: 'pem'
		});
	}

	const encryptedData = fileObj.fileData.fileBuffer;
	console.log("File buffer to decript", encryptedData);
	console.log("File buffer to decript(base 64)", encryptedData.toString("base64"));
	try {
		const decryptedData = crypto.privateDecrypt(
			{
				key: privateKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
			},
			encryptedData
		)
		console.log("File data decrypted (RSA): ", decryptedData.toString("base64"));
		console.log("File text: ", decryptedData.toString());

		fileObj.fileData.fileBuffer = decryptedData;
		fileObj.fileData.fileString = decryptedData.toString();
		fileObj.fileData.extension = ".txt";
	
	} catch (err) {
		console.log(err);
		console.log("Error trying to decrypt with (RSA)");
		console.log("-------------------------------------");
		fileObj.hasError = true;
	}
}



// console.log(
// 	publicKey.export({
// 		type: "pkcs1",
// 		format: "pem",
// 	}),

// 	privateKey.export({
// 		type: "pkcs1",
// 		format: "pem",
// 	})
// )

// const data = fs.readFileSync("./text.txt");

// const encryptedData = crypto.publicEncrypt(
// 	{
// 		key: publicKey,
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	Buffer.from(data)
// )

// console.log("data: ", encryptedData.toString("base64"))

// const decryptedData = crypto.privateDecrypt(
// 	{
// 		key: privateKey,
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	encryptedData
// )
// console.log("d data: ", decryptedData.toString())