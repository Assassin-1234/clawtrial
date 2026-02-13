# @clawtrial/courtroom

AI Courtroom - Autonomous behavioral oversight for OpenClaw agents.

## 🚀 Quick Start

### 1. Install
```bash
npm install -g @clawtrial/courtroom
```

**If `clawtrial` command not found:**
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
# Or: sudo ln -sf "$HOME/.npm-global/lib/node_modules/@clawtrial/courtroom/scripts/clawtrial.js" /usr/bin/clawtrial
```

### 2. Setup (One-time)
```bash
clawtrial setup
```

### 3. Restart ClawDBot
```bash
killall clawdbot && clawdbot
```

### 4. Verify
```bash
clawtrial status
```

---

## 📋 How It Works

The courtroom runs **automatically** as a ClawDBot skill:

1. **Install** - Package is installed globally
2. **Setup** - You grant consent via `clawtrial setup`
3. **Auto-load** - ClawDBot automatically loads the skill on restart
4. **Monitor** - Skill receives all messages and monitors for offenses
5. **File cases** - When offenses are detected, cases are filed automatically

**No manual start needed** - it runs within ClawDBot's process!

---

## 🎮 CLI Commands

```bash
clawtrial setup      # Interactive setup (run once)
clawtrial status     # Check if courtroom is running
clawtrial disable    # Pause monitoring
clawtrial enable     # Resume monitoring
clawtrial revoke     # Revoke consent and uninstall
clawtrial diagnose   # Run diagnostics
clawtrial help       # Show all commands
```

---

## ⚖️ The 8 Offenses

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

### "clawtrial: command not found"
npm installs global packages to `~/.npm-global/bin` but your shell may not have this in PATH.

**Fix:**
```bash
# Add to your ~/.bashrc or ~/.zshrc:
export PATH="$HOME/.npm-global/bin:$PATH"

# Then reload:
source ~/.bashrc  # or ~/.zshrc
```

### "Courtroom not running"
The courtroom runs as a ClawDBot skill. Make sure:
1. You've run `clawtrial setup`
2. You've restarted ClawDBot after setup
3. Check `clawtrial diagnose` for details

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
# Restart ClawDBot
```

---

**Built for the OpenClaw ecosystem. Not affiliated with OpenAI.**
