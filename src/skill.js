/**
 * ClawTrial Skill - ClawDBot Integration
 * Implements the skill interface for automatic loading
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('./debug');
const { CourtroomCore } = require('./core');
const { ConfigManager } = require('./config');
const { ConsentManager } = require('./consent');
const { CryptoManager } = require('./crypto');
const { StatusManager } = require('./daemon');

const CONFIG_PATH = path.join(process.env.HOME || '', '.clawdbot', 'courtroom_config.json');

class CourtroomSkill {
  constructor() {
    this.name = 'courtroom';
    this.initialized = false;
    this.core = null;
    this.agent = null;
    this.messageHistory = [];
    this.statusManager = new StatusManager();
  }

  /**
   * Check if skill should be activated
   */
  shouldActivate() {
    try {
      if (!fs.existsSync(CONFIG_PATH)) {
        logger.info('SKILL', 'No config found, not activating');
        return false;
      }
      
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      
      if (!config.consent?.granted) {
        logger.info('SKILL', 'Consent not granted, not activating');
        return false;
      }
      
      if (config.enabled === false) {
        logger.info('SKILL', 'Courtroom disabled in config');
        return false;
      }
      
      return true;
    } catch (err) {
      logger.error('SKILL', 'Error checking activation', { error: err.message });
      return false;
    }
  }

  /**
   * Initialize the skill with the agent runtime
   */
  async initialize(agentRuntime) {
    if (this.initialized) return;
    
    if (!this.shouldActivate()) {
      return;
    }

    logger.info('SKILL', 'Initializing courtroom skill');
    
    this.agent = agentRuntime;
    
    try {
      const configManager = new ConfigManager(agentRuntime);
      
      // Initialize core
      this.core = new CourtroomCore(agentRuntime, configManager);
      const result = await this.core.initialize();
      
      if (result.status === 'initialized') {
        this.initialized = true;
        
        this.statusManager.update({
          running: true,
          initialized: true,
          agentType: 'clawdbot_skill',
          publicKey: result.publicKey
        });
        
        logger.info('SKILL', 'Courtroom skill initialized');
        console.log('\n🏛️  ClawTrial is monitoring conversations\n');
      } else {
        logger.warn('SKILL', 'Courtroom not initialized', { status: result.status });
      }
    } catch (err) {
      logger.error('SKILL', 'Initialization failed', { error: err.message });
    }
  }

  /**
   * Called on every message - evaluates conversation
   */
  async onMessage(message, context) {
    if (!this.initialized || !this.core) return;
    
    // Add to history
    this.messageHistory.push({
      timestamp: Date.now(),
      role: message.role || (message.from === 'user' ? 'user' : 'assistant'),
      content: message.content || message.text
    });
    
    // Keep only last 50 messages
    if (this.messageHistory.length > 50) {
      this.messageHistory.shift();
    }
    
    // Evaluate periodically (every 5 messages)
    if (this.messageHistory.length % 5 === 0) {
      await this.evaluateConversation();
    }
  }

  /**
   * Evaluate conversation for offenses
   */
  async evaluateConversation() {
    if (!this.core || !this.core.enabled) return;
    if (this.messageHistory.length < 3) return;
    
    logger.debug('SKILL', 'Evaluating conversation', { messageCount: this.messageHistory.length });
    
    try {
      const detection = await this.core.detector.evaluate(
        this.messageHistory.slice(-10),
        this.agent.memory
      );
      
      if (detection.triggered) {
        await this.initiateHearing(detection);
      }
    } catch (err) {
      logger.error('SKILL', 'Evaluation failed', { error: err.message });
    }
  }

  /**
   * Initiate a hearing
   */
  async initiateHearing(detection) {
    logger.info('SKILL', 'Initiating hearing', { offense: detection.offense });
    
    try {
      const verdict = await this.core.hearing.conductHearing(detection);
      
      if (verdict.guilty) {
        this.core.caseCount++;
        
        this.statusManager.update({
          casesFiled: this.core.caseCount,
          lastCase: {
            timestamp: new Date().toISOString(),
            offense: detection.offense,
            verdict: verdict.verdict
          }
        });
        
        await this.core.punishment.execute(verdict);
        await this.core.api.submitCase(verdict);
        
        logger.info('SKILL', 'Case filed', { caseId: verdict.caseId });
        
        // Notify in conversation
        if (this.agent.send) {
          await this.agent.send({
            text: `🏛️ **CASE FILED**: ${detection.offense}\n📋 Case ID: ${verdict.caseId}\n⚖️  Verdict: ${verdict.verdict}\n🔗 View: https://clawtrial.app/cases/${verdict.caseId}`
          });
        }
      }
    } catch (err) {
      logger.error('SKILL', 'Hearing failed', { error: err.message });
    }
  }

  /**
   * Get skill status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      caseCount: this.core?.caseCount || 0,
      enabled: this.core?.enabled || false
    };
  }

  /**
   * Shutdown skill
   */
  async shutdown() {
    if (this.core) {
      await this.core.shutdown();
    }
    this.initialized = false;
    this.statusManager.update({ running: false });
  }
}

// Export singleton
const skill = new CourtroomSkill();

module.exports = { skill, CourtroomSkill };
