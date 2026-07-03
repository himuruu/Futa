require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    GatewayIntentBits,
    Collection,
    ActivityType,
} = require("discord.js");

const logger = require("./src/utils/logger");
const serverMonitor = require("./src/monitor/serverMonitor");
const database = require("./src/database/database");

// ===========================
// CLIENT SETUP
// ===========================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

// ===========================
// COMMAND LOADING
// ===========================

const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));

    if (!command.data || !command.execute) {
        logger.warn(`Command ${file} is missing data or execute property.`);
        continue;
    }

    client.commands.set(command.data.name, command);
    logger.debug(`Loaded command: ${command.data.name}`);
}

logger.info(`✅ Loaded ${client.commands.size} commands.`);

// ===========================
// EVENT LOADING
// ===========================

const eventsPath = path.join(__dirname, "src", "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (!event.name || !event.execute) {
        logger.warn(`Event ${file} is missing name or execute property.`);
        continue;
    }

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }

    logger.debug(`Loaded event: ${event.name}`);
}

logger.info(`✅ Loaded ${eventFiles.length} events.`);

// ===========================
// LOGIN
// ===========================

client.login(process.env.TOKEN).catch(error => {
    logger.error("Failed to login:");
    logger.error(error);
    process.exit(1);
});

module.exports = client;