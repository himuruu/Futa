const logger = require("../utils/logger");
const serverMonitor = require("../monitor/serverMonitor");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {
        logger.info(`✅ Logged in as ${client.user.tag}`);

        // Start monitoring the Minecraft server
        await serverMonitor.start(client);

        logger.info("🎮 Server monitoring activated.");
    }
};