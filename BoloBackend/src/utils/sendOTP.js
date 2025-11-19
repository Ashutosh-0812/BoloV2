const { OTP_SERVICE_PROVIDER, SMS_FROM } = require('../config/env');
const axios = require('axios'); // in case provider integration added later

// Mock implementation (prints OTP to console). Replace with Twilio/MSG91 code.
async function sendOTPMock(phone, otp) {
  console.log(`[MOCK OTP] Sending OTP ${otp} to ${phone} from ${SMS_FROM}`);
  return { success: true, provider: 'mock' };
}

async function sendOTP(phone, otp) {
  if (OTP_SERVICE_PROVIDER === 'mock' || !OTP_SERVICE_PROVIDER) {
    return sendOTPMock(phone, otp);
  }

  // Example: hook for Twilio/MSG91 etc.
  // Add provider-specific code here and return provider response.
  // For now fallback to mock.
  return sendOTPMock(phone, otp);
}

module.exports = sendOTP;
