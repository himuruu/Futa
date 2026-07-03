const logger = require("../utils/logger");

module.exports = {
    name: "guildCreate",

    async execute(guild) {

        logger.info(
            `Joined server: ${guild.name} (${guild.id})`
        );

        const channel = guild.systemChannel;

        if (!channel) return;

        channel.send({
            embeds: [
                {
                    color: 0x57F287,
                    title: "👋 Thanks for inviting me!",
                    description:
                        "Use `/help` to see all available commands.\n\n" +
                        "Configure your Minecraft server in **config/config.json**."
                }
            ]
        }).catch(() => {});

    }
};