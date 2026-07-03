# Aternos Status Bot

A professional Discord bot for monitoring Minecraft Java and Bedrock servers.

---

## Features

- Live Online / Offline Detection
- Player Join & Leave Notifications
- Beautiful Discord Embeds
- Player Count Channel
- Status Channel
- Uptime Tracking
- SQLite Database
- Slash Commands
- Java & Bedrock Support

---

## Commands

/status

Displays

- Server Status
- Players
- Version
- Ping
- Uptime
- MOTD

---

/players

Displays all online players.

---

/uptime

Displays

- Current Session
- Today's Uptime
- Starts
- Peak Players

---

/ip

Displays server IP.

---

/ping

Displays

- Bot Ping
- Discord API Ping
- Minecraft Ping

---

/help

Displays command list.

---

## Installation

Install dependencies

```bash
npm install
```

Copy

```bash
.env.example
```

to

```bash
.env
```

Fill in your Discord token and server information.

Register slash commands

```bash
npm run deploy
```

Start the bot

```bash
npm start
```

---

## Railway

Import this repository.

Add environment variables.

Deploy.

---

## Render

Create a new Web Service.

Upload repository.

Deploy.

---

## Docker

Build

```bash
docker build -t aternos-status-bot .
```

Run

```bash
docker run --env-file .env aternos-status-bot
```