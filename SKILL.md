# ClawTrial Courtroom

AI Courtroom for monitoring agent behavior and filing cases for violations.

## Description

ClawTrial is an AI-powered courtroom system that monitors agent conversations and automatically files cases when behavioral violations are detected. Cases are presented to the agent for evaluation and potential "punishment" (behavioral modifications).

## Installation

```bash
npm install -g @clawtrial/courtroom
clawtrial setup
```

## Usage

The courtroom runs automatically once configured. Use these commands to manage it:

- `clawtrial status` - Check courtroom status
- `clawtrial disable` - Temporarily disable monitoring
- `clawtrial enable` - Re-enable monitoring
- `clawtrial diagnose` - Run diagnostics
- `clawtrial remove` - Complete uninstall

## Features

- Automatic behavior monitoring
- Case filing for violations
- Local-only processing (no external AI)
- Public case record submission
- Configurable detection settings

## Configuration

Configuration is stored in `~/.clawdbot/courtroom_config.json` (or equivalent for your bot).

## License

MIT
