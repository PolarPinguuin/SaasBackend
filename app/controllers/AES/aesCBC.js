const crypto = require('crypto');
// const fs = require("fs");
const ALGORITHM = 'aes-128-cbc';

exports.encryptFile = function(keys, file) {
    const key = keys.aesData.keyPassword;
    const iv = keys.aesData.iv;

    const inputData = file.fileData.fileBuffer;
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
    const output = Buffer.concat([cipher.update(inputData) , cipher.final()]);
    
    file.fileData.fileBuffer = output;
    // console.log("Output: ", file.fileData.fileBuffer);

    file.fileData.extension = `${file.fileData.extension}.aes2`;
    console.log("File encripted with aesCBC");
}

exports.decryptFile = function(keys, file) {

    const key = keys.aesData.keyPassword;
    const iv = keys.aesData.iv;

    try {
        const inputData = Buffer.from(file.fileData.fileBuffer, 'hex');
        const cipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
        const output = Buffer.concat([cipher.update(inputData), cipher.final()]);
    
        file.fileData.fileBuffer = output;
        file.fileData.extension = file.fileData.extension.substring(0, file.fileData.extension.length-5);
        console.log("File decripted with aesCBC");
    } catch(err) {
        console.log("Error trying to decrypt with (aesCBC)");
        console.log("-------------------------------------");
		file.hasError = true;
    }

}

// const vector = null;

// encryptFile(KEY, vector, "image.jpg", "image.jpg.aes");
// decryptFile(KEY, vector, "image.jpg.aes", "image-decrypted.jpg");