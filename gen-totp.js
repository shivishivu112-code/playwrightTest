require('dotenv').config();
const { authenticator } = require('otplib');
console.log(authenticator.generate(process.env.TOTP_SECRET));