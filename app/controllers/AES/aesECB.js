const crypto = require("crypto");
const ALGORITHM = "aes-128-ecb";

// const fs = require("fs");

exports.encryptFile = function(keys, file) {
    if (!keys) {
        throw new Error("Could not find the key");
    }
    console.log(file);
    const inputData = file.fileData.fileBuffer;
    const cipher = crypto.createCipheriv(ALGORITHM, keys.aesData.keyPassword, Buffer.alloc(0));
    const output = Buffer.concat([cipher.update(inputData) , cipher.final()]);

    file.fileData.fileBuffer = output;
    file.fileData.extension = `${file.fileData.extension}.aes`;

    console.log("File encripted with aesECB");
    console.log("File buffer length,", output.length);
    console.log("File buffer ,", output);
}

exports.decryptFile = function(keys, file) {
    if (!keys) {
        throw new Error("Could not find the keys");
    }
    console.log("File buffer", file.fileData.fileBuffer);
    console.log("File buffer length", file.fileData.fileBuffer.length);
    const inputData = file.fileData.fileBuffer;

    try {
        console.log("Aici keys,", keys.aesData.keyPassword);
        const cipher = crypto.createDecipheriv(ALGORITHM, keys.aesData.keyPassword, Buffer.alloc(0));
        const output = Buffer.concat([cipher.update(inputData) , cipher.final()]);
        
        file.fileData.fileBuffer = output;
        file.fileData.extension = file.fileData.extension.substring(0, file.fileData.extension.length-4);
        console.log("File decripted with aesECB");
    } catch(err) {
        console.log(err);
        console.log("Error trying to decrypt with (aesECB)");
        console.log("-------------------------------------");
		file.hasError = true;
    }

}

// const KEY = Buffer.from("0123456789ABDCEF", "utf8");

// // const fileName = 

// encryptFile(KEY, "image.jpg", "image.jpg.aes");
// decryptFile(KEY, "image.jpg.aes", "image-decrypted.jpg");