
// shared/utils/uuid.js

const crypto = require('crypto');

function generateSixDigitNumericUUID() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hex digits
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const sixDigitNumber = randomNumber % 1000000; // Ensure it's 6 digits
    return sixDigitNumber.toString().padStart(6, '0');
}

function generateTenDigitNumericUUID() {
    const randomBytes = crypto.randomBytes(5); // 5 bytes = 10 hex digits
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const tenDigitNumber = randomNumber % 10000000000; // Ensure it's 10 digits
    return tenDigitNumber.toString().padStart(10, '0');
}

function generateTwelveDigitUUID() {
    const randomBytes = crypto.randomBytes(6); // 6 bytes = 12 hex digits
    const uuid = randomBytes.toString('hex');
    return uuid.substring(0, 12); // 取前12位作为UUID
}

function generateLowercaseAlphanumericUUID() {
    const randomBytes = crypto.randomBytes(8); // 8 bytes = 16 hex digits
    const uuid = randomBytes.toString('hex');
    return uuid.padEnd(16, '0');
}

module.exports = {
    generateSixDigitNumericUUID,
    generateTenDigitNumericUUID,
    generateTwelveDigitUUID,
    generateLowercaseAlphanumericUUID
};
