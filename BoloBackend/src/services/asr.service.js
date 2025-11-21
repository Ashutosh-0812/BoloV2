// src/services/asr.service.js
const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const FormData = require('form-data');
const { ASR_API_URL, ASR_ACCESS_TOKEN, MT_API_URL, MT_ACCESS_TOKEN } = require('../config/env');

ffmpeg.setFfmpegPath('C:\\Users\\sharm\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0-full_build\\bin\\ffmpeg.exe');

function trimSilence(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioFilters('silenceremove=stop_periods=-1:stop_duration=1:stop_threshold=-50dB')
            .on('end', () => resolve())
            .on('error', reject)
            .save(outputPath);
    });
}

function getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
}

function chunkAudio(inputPath, chunkLength = 20) {
    return new Promise(async (resolve, reject) => {
        try {
            const duration = await getAudioDuration(inputPath);
            const chunks = [];
            let start = 0;
            let idx = 0;
            while (start < duration) {
                const outputChunk = path.join(path.dirname(inputPath), `chunk_${idx}.wav`);
                await new Promise((res, rej) => {
                    ffmpeg(inputPath)
                        .setStartTime(start)
                        .duration(Math.min(chunkLength, duration - start))
                        .output(outputChunk)
                        .on('end', res)
                        .on('error', rej)
                        .run();
                });
                chunks.push({ path: outputChunk, start, end: Math.min(start + chunkLength, duration) });
                start += chunkLength;
                idx++;
            }
            resolve(chunks);
        } catch (err) {
            reject(err);
        }
    });
}

async function translateText(text) {
    if (!MT_API_URL || !MT_ACCESS_TOKEN) {
        console.warn('MT API not configured, skipping translation');
        return text;
    }
    try {
        const response = await axios.post(MT_API_URL, {
            input_text: text
        }, {
            headers: {
                'access-token': MT_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        if (response.data.status === 'success') {
            return response.data.data.output_text;
        } else {
            console.warn('MT translation failed:', response.data.error);
            return text;
        }
    } catch (error) {
        console.warn('MT API error:', error.message);
        return text;
    }
}

async function transcribeAudioChunk(chunkPath) {
    if (!ASR_API_URL || !ASR_ACCESS_TOKEN) {
        throw new Error('ASR API URL or Access Token not set');
    }
    const stats = fs.statSync(chunkPath);
    if (stats.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
    }
    const form = new FormData();
    form.append('audio_file', fs.createReadStream(chunkPath));
    try {
        const response = await axios.post(ASR_API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'access-token': ASR_ACCESS_TOKEN,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        if (response.data.status === 'success') {
            // Ensure the recognized text is properly decoded as UTF-8
            const recognizedText = Buffer.from(response.data.data.recognized_text, 'utf8').toString('utf8');
            return recognizedText;
        } else {
            throw new Error(response.data.error || 'ASR failed');
        }
    } catch (err) {
        throw new Error('ASR request failed: ' + err.message);
    }
}

async function processAudioForASR(inputPath) {
    // 1. Trim silence
    const trimmedPath = path.join(path.dirname(inputPath), 'trimmed_' + path.basename(inputPath));
    await trimSilence(inputPath, trimmedPath);
    // 2. Chunk audio
    const chunks = await chunkAudio(trimmedPath, 20);
    // 3. Transcribe each chunk and translate to English
    const transcript = [];
    for (const chunk of chunks) {
        const text = await transcribeAudioChunk(chunk.path);
        const translatedText = await translateText(text);
        transcript.push({ text: translatedText, start: chunk.start, end: chunk.end });
    }
    return transcript;
}

module.exports = { processAudioForASR };