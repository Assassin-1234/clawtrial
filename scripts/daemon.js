#!/usr/bin/env node

/**
 * Courtroom Daemon - Runs the skill as a background process
 */

const { skill } = require('../src/skill');
const { StatusManager } = require('../src/daemon');
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

// Create status manager
const statusManager = new StatusManager();

// Initialize skill
skill.initialize(mockAgent).then(() => {
  const status = skill.getStatus();
  if (status.initialized) {
    console.log('🏛️  Courtroom daemon started, PID:', process.pid);
    
    // Update status file
    statusManager.update({
      running: true,
      initialized: true,
      agentType: 'standalone_daemon',
      pid: process.pid,
      startedAt: new Date().toISOString()
    });
    
    // Keep process alive with heartbeat
    setInterval(() => {
      statusManager.update({ lastCheck: new Date().toISOString() });
    }, 30000); // Every 30 seconds
    
    console.log('🏛️  Courtroom is monitoring conversations');
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
  statusManager.update({ running: false });
  if (skill) {
    await skill.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🏛️  Shutting down courtroom daemon...');
  statusManager.update({ running: false });
  if (skill) {
    await skill.shutdown();
  }
  process.exit(0);
});
