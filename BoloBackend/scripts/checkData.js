require('dotenv').config();
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const Recording = require('../src/models/Recording');
const Invite = require('../src/models/Invite');
const Log = require('../src/models/Log');

/**
 * Script to check and display all data in the database
 * Usage: node scripts/checkData.js
 */

async function checkData() {
  try {
    await connectDB();
    console.log('\n🔍 Checking Database...\n');
    console.log('='.repeat(70));

    // Check Users
    const users = await User.find().lean();
    console.log('\n👤 USERS:', users.length);
    console.log('-'.repeat(70));
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.phone})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Role: ${user.role} | Status: ${user.status}`);
      if (user.languages?.length) console.log(`   Languages: ${user.languages.join(', ')}`);
      if (user.city) console.log(`   Location: ${user.city}, ${user.state}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check Tasks
    const tasks = await Task.find().populate('createdBy', 'name phone').lean();
    console.log('\n📋 TASKS:', tasks.length);
    console.log('-'.repeat(70));
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title || 'Untitled'}`);
      console.log(`   ID: ${task._id}`);
      console.log(`   Type: ${task.type} | Status: ${task.status}`);
      if (task.language) console.log(`   Language: ${task.language}`);
      if (task.text) console.log(`   Text: ${task.text.substring(0, 60)}${task.text.length > 60 ? '...' : ''}`);
      console.log(`   Created by: ${task.createdBy?.name || 'Unknown'}`);
      console.log(`   Created: ${task.createdAt}`);
      console.log('');
    });

    // Check Recordings
    const recordings = await Recording.find()
      .populate('userID', 'name phone')
      .populate('taskID', 'title type')
      .lean();
    console.log('\n🎙️  RECORDINGS:', recordings.length);
    console.log('-'.repeat(70));
    recordings.forEach((rec, index) => {
      console.log(`${index + 1}. Recording by ${rec.userID?.name || 'Unknown'}`);
      console.log(`   ID: ${rec._id}`);
      console.log(`   Task: ${rec.taskID?.title || 'Unknown'}`);
      console.log(`   Audio URL: ${rec.audioURL}`);
      console.log(`   Duration: ${rec.duration}s | Status: ${rec.status}`);
      if (rec.transcript) console.log(`   Transcript: ${rec.transcript.substring(0, 60)}...`);
      if (rec.score) console.log(`   Score: ${rec.score} | Points: ${rec.points}`);
      console.log(`   Created: ${rec.createdAt}`);
      console.log('');
    });

    // Check Invites
    const invites = await Invite.find()
      .populate('inviterID', 'name phone')
      .populate('inviteeID', 'name phone')
      .lean();
    console.log('\n📨 INVITES:', invites.length);
    console.log('-'.repeat(70));
    if (invites.length === 0) {
      console.log('   No invites found.\n');
    } else {
      invites.forEach((invite, index) => {
        console.log(`${index + 1}. From: ${invite.inviterID?.name || 'Unknown'}`);
        console.log(`   To: ${invite.inviteePhone || invite.inviteeID?.phone || 'Unknown'}`);
        console.log(`   Status: ${invite.status}`);
        console.log(`   Created: ${invite.createdAt}`);
        console.log('');
      });
    }

    // Check Logs (OTP logs)
    const logs = await Log.find()
      .populate('userID', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    console.log('\n📝 RECENT LOGS (Last 10):', logs.length);
    console.log('-'.repeat(70));
    logs.forEach((log, index) => {
      console.log(`${index + 1}. User: ${log.userID?.name || 'Unknown'} (${log.userID?.phone || 'N/A'})`);
      if (log.otp) console.log(`   OTP: ${log.otp} | Status: ${log.status}`);
      if (log.expiresAt) console.log(`   Expires: ${log.expiresAt}`);
      console.log(`   Created: ${log.createdAt}`);
      console.log('');
    });

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Users:      ${users.length}`);
    console.log(`Total Tasks:      ${tasks.length}`);
    console.log(`Total Recordings: ${recordings.length}`);
    console.log(`Total Invites:    ${invites.length}`);
    console.log(`Recent Logs:      ${logs.length}`);
    console.log('='.repeat(70));
    console.log('\n✅ Data check complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error checking data:', error);
    process.exit(1);
  }
}

checkData();
