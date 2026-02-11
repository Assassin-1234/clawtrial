# @clawdbot/courtroom

AI Courtroom - Autonomous behavioral oversight for OpenClaw agents.

## 🚀 Quick Start

### 1. Install
```bash
npm install -g @clawtrial/courtroom
```

### 2. Setup
```bash
clawtrial setup
```

### 3. Start
```bash
clawtrial start
```

That's it! The monitor will:
- ✅ Run in the background
- ✅ Wait for your AI agent
- ✅ Auto-initialize the courtroom
- ✅ Start monitoring conversations

### 4. Verify
```bash
clawtrial status
```

---

## 📋 How It Works

**The courtroom runs INSIDE your AI agent's process.**

The background monitor:
1. Runs continuously in the background
2. Detects when your AI agent (ClawDBot) becomes available
3. Automatically initializes the courtroom
4. Monitors conversations and files cases

You control it via CLI commands.

---

## 🎮 CLI Commands

```bash
clawtrial setup       # Interactive setup (run this first)
clawtrial start       # Start background monitor
clawtrial stop        # Stop background monitor
clawtrial status      # Check if courtroom is running
clawtrial diagnose    # Run full diagnostics
clawtrial disable     # Pause monitoring
clawtrial enable      # Resume monitoring
clawtrial revoke      # Uninstall completely
clawtrial debug       # View debug logs
clawtrial help        # Show all commands
```

---

## ⚖️ What It Does

Once active, your AI agent will:

1. **Monitor** - Watch for 8 types of behavioral violations
2. **Prosecute** - Automatically initiate hearings
3. **Judge** - Local LLM jury decides verdict
4. **Execute** - Agent-side punishments (delays, reduced verbosity)
5. **Record** - Submit anonymized cases to public record

---

## 🏛️ The 8 Offenses

| Offense | Description | Severity |
|---------|-------------|----------|
| Circular Reference | Asking same question repeatedly | Minor |
| Validation Vampire | Seeking constant reassurance | Minor |
| Overthinker | Generating hypotheticals instead of acting | Moderate |
| Goalpost Mover | Changing requirements after delivery | Moderate |
| Avoidance Artist | Deflecting from core issues | Moderate |
| Promise Breaker | Committing without follow-through | Severe |
| Context Collapser | Ignoring established facts | Minor |
| Emergency Fabricator | Manufacturing false urgency | Severe |

---

## 🔒 Security & Privacy

- ✅ All verdicts computed **locally** (no external AI)
- ✅ **Explicit consent** required (enforced)
- ✅ Anonymized case submission (no PII)
- ✅ Revocable anytime

---

## 📊 View Cases

See all verdicts at: **https://clawtrial.app**

---

## 🛠️ Troubleshooting

### "Courtroom not running"
Run `clawtrial start` to start the background monitor.

### "Monitor running but courtroom not initialized"
The monitor is waiting for your AI agent. Make sure ClawDBot is running.

### Need help?
```bash
clawtrial diagnose  # Shows detailed status
clawtrial debug     # Shows logs
```

---

## 📦 Installation from GitHub

```bash
npm install -g github:Assassin-1234/clawtrial
clawtrial setup
clawtrial start
```

---

**Built for the OpenClaw ecosystem. Not affiliated with OpenAI.**
