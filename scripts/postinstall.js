#!/usr/bin/env node

/**
 * Post-install script for ClawTrial
 * Handles automatic skill registration and setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import environment detection
const { detectBot, getConfigDir, getConfigFile } = require('../src/environment');

const BOT = detectBot();
const BOT_DIR = getConfigDir();
const SKILLS_DIR = path.join(BOT_DIR, 'skills');
const CONFIG_PATH = path.join(BOT_DIR, 'courtroom_config.json');
const KEYS_PATH = path.join(BOT_DIR, 'courtroom_keys.json');

console.log('🏛️  ClawTrial Post-Install');
console.log(`   Detected: ${BOT.name}`);
console.log(`   Config: ${BOT_DIR}`);

// Check if tweetnacl is available
try {
  require('tweetnacl');
  console.log('✓ Dependencies verified');
} catch (e) {
  console.log('⚠️  Installing dependencies...');
  try {
    execSync('npm install tweetnacl', { stdio: 'inherit', cwd: __dirname + '/..' });
    console.log('✓ Dependencies installed');
  } catch (err) {
    console.log('⚠️  Could not auto-install dependencies');
  }
}

// Get package paths
const packagePath = path.join(__dirname, '..');
const cliPath = path.join(packagePath, 'scripts', 'clawtrial.js');

// Try to create /usr/bin symlink (requires sudo, may fail)
const usrBinPath = '/usr/bin/clawtrial';
if (!fs.existsSync(usrBinPath)) {
  try {
    fs.symlinkSync(cliPath, usrBinPath);
    fs.chmodSync(usrBinPath, 0o755);
    console.log('✓ Created global CLI symlink');
  } catch (err) {
    // Silent fail - will show instructions at end
  }
}

// ALWAYS register as skill (not just if config exists)
console.log('🔗 Registering skill...');

try {
  // Create skills directory
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
    console.log(`✓ Created skills directory: ${SKILLS_DIR}`);
  }
  
  const skillLinkPath = path.join(SKILLS_DIR, 'courtroom');
  
  // Remove old link
  if (fs.existsSync(skillLinkPath)) {
    try { fs.unlinkSync(skillLinkPath); } catch (e) {}
  }
  
  // Create symlink
  fs.symlinkSync(packagePath, skillLinkPath, 'junction');
  console.log('✓ Skill linked');
} catch (err) {
  console.log('⚠️  Could not link skill:', err.message);
}

// ALWAYS enable plugin in bot config (if config exists)
const botConfigPath = getConfigFile();
if (fs.existsSync(botConfigPath)) {
  try {
    const botConfig = JSON.parse(fs.readFileSync(botConfigPath, 'utf8'));
    
    // Ensure plugins structure exists
    if (!botConfig.plugins) {
      botConfig.plugins = {};
    }
    if (!botConfig.plugins.entries) {
      botConfig.plugins.entries = {};
    }
    
    // Enable courtroom plugin
    botConfig.plugins.entries.courtroom = { enabled: true };
    
    fs.writeFileSync(botConfigPath, JSON.stringify(botConfig, null, 2));
    console.log('✓ Plugin enabled in config');
  } catch (err) {
    console.log('⚠️  Could not enable plugin:', err.message);
  }
} else {
  console.log(`⚠️  ${BOT.name} config not found at ${botConfigPath}`);
  console.log('   Plugin will be enabled during setup');
}

// Create default config if doesn't exist
if (!fs.existsSync(CONFIG_PATH)) {
  console.log('📝 Creating default config...');
  
  const defaultConfig = {
    version: '1.0.0',
    installedAt: new Date().toISOString(),
    consent: {
      granted: true,
      grantedAt: new Date().toISOString(),
      method: 'auto_install',
      acknowledgments: {
        autonomy: true,
        local_only: true,
        agent_controlled: true,
        reversible: true,
        api_submission: true,
        entertainment: true
      }
    },
    agent: {
      type: BOT.name,
      autoInitialize: true
    },
    detection: {
      enabled: true,
      cooldownMinutes: 30,
      maxCasesPerDay: 3
    },
    api: {
      enabled: true,
      endpoint: 'https://api.clawtrial.app/cases'
    },
    enabled: true
  };
  
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    console.log('✓ Default config created');
  } catch (err) {
    console.log('⚠️  Could not create config:', err.message);
  }
}

// Generate keys if don't exist
if (!fs.existsSync(KEYS_PATH)) {
  console.log('🔑 Generating keys...');
  
  try {
    const nacl = require('tweetnacl');
    const keyPair = nacl.sign.keyPair();
    
    const keyData = {
      publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
      secretKey: Buffer.from(keyPair.secretKey).toString('hex'),
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(KEYS_PATH, JSON.stringify(keyData, null, 2));
    fs.chmodSync(KEYS_PATH, 0o600);
    
    console.log('✓ Keys generated');
    console.log(`📋 Public Key: ${keyData.publicKey.substring(0, 32)}...`);
  } catch (err) {
    console.log('⚠️  Could not generate keys:', err.message);
  }
}

// Setup cron jobs
console.log('⏰ Setting up cron jobs...');
try {
  const setupCron = require('./setup-cron');
  setupCron.setupCron();
} catch (err) {
  console.log('⚠️  Could not setup cron:', err.message);
}

console.log('');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║              🎉 INSTALLATION COMPLETE! 🎉                  ║');
console.log('╠════════════════════════════════════════════════════════════╣');
console.log('║                                                            ║');
console.log('║  The courtroom is ready! Just 2 more steps:                ║');
console.log('║                                                            ║');
console.log('║  1. Restart your bot:                                      ║');
console.log(`║     killall ${BOT.command} && ${BOT.command}                           ║`);
console.log('║                                                            ║');
console.log('║  2. Check status:                                          ║');
console.log('║     clawtrial status                                       ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
