#!/usr/bin/env node

/**
 * Courtroom Daemon - Runs the skill as a background process
 */

const { skill } = require('../src/skill');
const fs = require('fs');
const path = require('path');

// Create minimal mock agent
const mockAgent = {
  memory: { 
    get: async () => null, 
    set: async () => {} 
  },
  send: async () => {}
};

// Initialize skill
skill.initialize(mockAgent).then(() => {
  const status = skill.getStatus();
  if (status.initialized) {
    console.log('🏛️  Courtroom daemon started, PID:', process.pid);
    
    // Write PID file
    const pidPath = path.join(process.env.HOME || '', '.clawdbot', 'courtroom_daemon.pid');
    fs.writeFileSync(pidPath, process.pid.toString());
    
    // Keep process alive
    setInterval(() => {
      // Heartbeat - update status file
      if (skill.statusManager) {
        skill.statusManager.update({ lastCheck: new Date().toISOString() });
      }
    }, 30000); // Every 30 seconds
  } else {
    console.error('❌ Skill failed to initialize');
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Failed to start daemon:', err.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🏛️  Shutting down courtroom daemon...');
  if (skill) {
    await skill.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🏛️  Shutting down courtroom daemon...');
  if (skill) {
    await skill.shutdown();
  }
  process.exit(0);
});
