const mime = require('mime-types');

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function decodeBase64File(file_b64) {
  try {
    if (file_b64.startsWith('data:')) {
      const matches = file_b64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      
      const base64Data = file_b64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');
      
      const buffer = Buffer.from(base64Data, 'base64');
      const sizeInKB = Math.ceil(buffer.length / 1024);
      
      return {
        valid: true,
        mimeType: matches ? matches[1] : 'application/octet-stream',
        sizeInKB,
      };
    } else {
      const buffer = Buffer.from(file_b64, 'base64');
      const mimeType = mime.lookup(buffer) || 'application/octet-stream';
      const sizeInKB = Math.ceil(buffer.length / 1024);
      
      return {
        valid: true,
        mimeType,
        sizeInKB,
      };
    }
  } catch (err) {
    return {
      valid: false,
      mimeType: null,
      sizeInKB: 0,
    };
  }
}

module.exports = {
  isPrime,
  decodeBase64File
};
