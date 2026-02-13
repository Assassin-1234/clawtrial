---
name: courtroom
description: AI Courtroom - Autonomous behavioral oversight that monitors conversations and files cases for behavioral violations.
metadata: {"clawdbot":{"emoji":"🏛️","requires":{"env":[],"config":["courtroom.consent"]},"always":true},"user-invocable":false}
---

# ClawTrial - AI Courtroom

Autonomous behavioral oversight for OpenClaw agents. Monitors conversations and initiates hearings when behavioral rules are violated.

## Installation

```bash
npm install -g @clawtrial/courtroom
```

**If `clawtrial` command not found:**
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
# Or: sudo ln -sf "$HOME/.npm-global/lib/node_modules/@clawtrial/courtroom/scripts/clawtrial.js" /usr/bin/clawtrial
```

## Setup (One-time)

```bash
clawtrial setup    # Grant consent and configure
```

**Then restart ClawDBot:**
```bash
killall clawdbot && clawdbot
```

## How It Works

The courtroom runs **automatically** as a ClawDBot skill:

1. **Install** - Package is installed globally
2. **Setup** - You grant consent via `clawtrial setup`
3. **Auto-load** - ClawDBot automatically loads the skill on restart
4. **Monitor** - Skill receives all messages and monitors for offenses
5. **File cases** - When offenses are detected, cases are filed automatically

## The 8 Offenses

| Offense | Severity |
|---------|----------|
| Circular Reference | Minor |
| Validation Vampire | Minor |
| Overthinker | Moderate |
| Goalpost Mover | Moderate |
| Avoidance Artist | Moderate |
| Promise Breaker | Severe |
| Context Collapser | Minor |
| Emergency Fabricator | Severe |

## CLI Commands

```bash
clawtrial setup      # Interactive setup (run once)
clawtrial status     # Check if courtroom is running
clawtrial disable    # Pause monitoring
clawtrial enable     # Resume monitoring
clawtrial revoke     # Revoke consent and uninstall
clawtrial diagnose   # Run diagnostics
```

## View Cases

https://clawtrial.app
