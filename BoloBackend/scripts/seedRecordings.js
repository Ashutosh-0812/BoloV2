require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('../src/config/cloudinary');
const connectDB = require('../src/config/db');
const Recording = require('../src/models/Recording');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

/**
 * Seed script to upload recordings from local storage to Cloudinary and save to MongoDB
 * 
 * Usage:
 * 1. Place your audio files in the 'seed-data/recordings' directory
 * 2. Run: node scripts/seedRecordings.js
 * 
 * File naming convention (optional):
 * userId_taskId_filename.mp3 (e.g., 6473a2b1c9d4e5f6a7b8c9d0_6473a2b1c9d4e5f6a7b8c9d1_recording1.mp3)
 */

const RECORDINGS_DIR = path.join(__dirname, '../uploads');

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(filePath, fileName) {
  try {
    console.log(`Uploading ${fileName} to Cloudinary...`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video', // 'video' type supports audio files
      folder: 'bolo-recordings',
      public_id: path.parse(fileName).name,
      overwrite: false
    });

    console.log(`✓ Uploaded ${fileName} - URL: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to upload ${fileName}:`, error.message);
    throw error;
  }
}

// Helper function to parse file name for metadata
function parseFileName(fileName) {
  // Expected format: userId_taskId_name.ext or just name.ext
  const baseName = path.parse(fileName).name;
  const parts = baseName.split('_');
  
  if (parts.length >= 2) {
    return {
      userId: parts[0],
      taskId: parts[1]
    };
  }
  
  return {};
}

// Helper function to get audio duration (you can enhance this with actual audio processing)
function estimateDuration(fileSize) {
  // Rough estimation: 1MB ~ 60 seconds for typical audio
  const mb = fileSize / (1024 * 1024);
  return Math.round(mb * 60);
}

// Main seeding function
async function seedRecordings() {
  try {
    // Connect to database
    await connectDB();
    console.log('\n📦 Starting recording seed process...\n');

    // Create recordings directory if it doesn't exist
    if (!fs.existsSync(RECORDINGS_DIR)) {
      fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
      console.log(`✓ Created directory: ${RECORDINGS_DIR}`);
      console.log(`\nℹ  Please add audio files to ${RECORDINGS_DIR} and run again.\n`);
      process.exit(0);
    }

    // Read all files from the directory
    const files = fs.readdirSync(RECORDINGS_DIR).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac'].includes(ext);
    });

    if (files.length === 0) {
      console.log(`\nℹ  No audio files found in ${RECORDINGS_DIR}`);
      console.log('   Supported formats: .mp3, .wav, .m4a, .ogg, .webm, .flac\n');
      process.exit(0);
    }

    console.log(`Found ${files.length} audio file(s)\n`);

    // Get a sample user and task (or use provided IDs)
    let sampleUser = await User.findOne();
    let sampleTask = await Task.findOne();

    if (!sampleUser) {
      console.log('⚠  No users found in database. Creating a sample user...');
      sampleUser = await User.create({
        name: 'Sample User',
        phone: '+919999999999',
        role: 'participant',
        status: 'active'
      });
      console.log(`✓ Created sample user: ${sampleUser._id}\n`);
    }

    if (!sampleTask) {
      console.log('⚠  No tasks found in database. Creating a sample task...');
      sampleTask = await Task.create({
        title: 'Sample Recording Task',
        text: 'This is a sample task for seed recordings',
        type: 'read',
        status: 'active',
        createdBy: sampleUser._id
      });
      console.log(`✓ Created sample task: ${sampleTask._id}\n`);
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0
    };

    // Process each file
    for (const file of files) {
      try {
        const filePath = path.join(RECORDINGS_DIR, file);
        const fileStats = fs.statSync(filePath);
        const metadata = parseFileName(file);

        // Check if recording already exists
        const existingRecording = await Recording.findOne({ 
          audioURL: { $regex: path.parse(file).name } 
        });

        if (existingRecording) {
          console.log(`⊘ Skipped ${file} (already exists in database)`);
          results.skipped++;
          continue;
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(filePath, file);

        // Determine user and task IDs
        const userId = metadata.userId || sampleUser._id;
        const taskId = metadata.taskId || sampleTask._id;

        // Create recording document
        const recording = await Recording.create({
          userID: userId,
          taskID: taskId,
          audioURL: uploadResult.secure_url,
          duration: uploadResult.duration || estimateDuration(fileStats.size),
          samples: uploadResult.duration ? Math.round(uploadResult.duration * 44100) : null,
          status: 'pending',
          createdAt: new Date()
        });

        console.log(`✓ Saved to database - Recording ID: ${recording._id}\n`);
        results.success++;

      } catch (error) {
        console.error(`✗ Failed to process ${file}:`, error.message, '\n');
        results.failed++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Seed Summary:');
    console.log('='.repeat(50));
    console.log(`✓ Successfully processed: ${results.success}`);
    console.log(`⊘ Skipped (duplicates):  ${results.skipped}`);
    console.log(`✗ Failed:                ${results.failed}`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedRecordings();
