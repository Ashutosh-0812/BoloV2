// src/services/ocr.service.js
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { OCR_API_URL, OCR_ACCESS_TOKEN } = require('../config/env');

// Replace with your actual API endpoint and access token
// const OCR_API_URL = process.env.OCR_API_URL;
// const OCR_ACCESS_TOKEN = process.env.OCR_ACCESS_TOKEN;

async function extractTextFromImage(imagePath) {
    if (!OCR_API_URL || !OCR_ACCESS_TOKEN) {
        throw new Error('OCR API URL or Access Token not set');
    }
    const stats = fs.statSync(imagePath);
    if (stats.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
    }
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    try {
        const response = await axios.post(OCR_API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'access-token': OCR_ACCESS_TOKEN,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        if (response.data.status === 'success') {
            return response.data.data.decoded_text;
        } else {
            throw new Error(response.data.error || 'OCR failed');
        }
    } catch (err) {
        throw new Error('OCR request failed: ' + err.message);
    }
}

module.exports = { extractTextFromImage };