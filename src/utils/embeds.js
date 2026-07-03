const { EmbedBuilder } = require("discord.js");

module.exports = {

    success(title, description) {

        return new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

    },

    error(title, description) {

        return new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

    },

    warning(title, description) {

        return new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

    },

    info(title, description) {

        return new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

    },

    serverStatus(data) {

        return new EmbedBuilder()
            .setColor(data.online ? 0x57F287 : 0xED4245)
            .setTitle(
                data.online
                    ? "🟢 Minecraft Server Online"
                    : "🔴 Minecraft Server Offline"
            )
            .addFields(
                {
                    name: "Players",
                    value: `${data.players}/${data.maxPlayers}`,
                    inline: true
                },
                {
                    name: "Version",
                    value: data.version || "Unknown",
                    inline: true
                },
                {
                    name: "Latency",
                    value: `${data.ping} ms`,
                    inline: true
                }
            )
            .setTimestamp();

    },

    playerJoin(name) {

        return new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("🟢 Player Joined")
            .setDescription(`**${name}** joined the server.`)
            .setTimestamp();

    },

    playerLeave(name) {

        return new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle("🔴 Player Left")
            .setDescription(`**${name}** left the server.`)
            .setTimestamp();

    }

};