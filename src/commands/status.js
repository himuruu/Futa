const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const monitor = require("../monitor/serverMonitor");
const uptimeTracker = require("../monitor/uptimeTracker");
const database = require("../database/database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Displays the current Minecraft server status."),

    async execute(interaction) {

        const server = monitor.getData();

        // Server Offline
        if (!server.online) {

            const stats = database.getTodayStats();

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("🔴 Minecraft Server")
                .setDescription("The server is currently **Offline**.")
                .addFields(
                    {
                        name: "📅 Today's Starts",
                        value: `${stats.starts}`,
                        inline: true
                    },
                    {
                        name: "👥 Peak Players",
                        value: `${stats.peak_players}`,
                        inline: true
                    },
                    {
                        name: "⏱ Today's Uptime",
                        value: `${Math.floor(stats.total_uptime / 3600)}h ${Math.floor((stats.total_uptime % 3600) / 60)}m`,
                        inline: true
                    }
                )
                .setFooter({
                    text: "Aternos Status Bot"
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        }

        // Player List
        const players =
            server.playerList.length > 0
                ? server.playerList
                      .map(player => `• ${player.name}`)
                      .join("\n")
                : "No players online.";

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("🟢 Minecraft Server")
            .setDescription("The server is currently **Online**.")
            .addFields(
                {
                    name: "👥 Players",
                    value: `${server.players}/${server.maxPlayers}`,
                    inline: true
                },
                {
                    name: "📦 Version",
                    value: server.version,
                    inline: true
                },
                {
                    name: "📶 Ping",
                    value: `${server.ping} ms`,
                    inline: true
                },
                {
                    name: "🌍 Address",
                    value: `${process.env.HOST}:${process.env.PORT}`,
                    inline: false
                },
                {
                    name: "📝 MOTD",
                    value: server.motd || "Unknown",
                    inline: false
                },
                {
                    name: "⏱ Uptime",
                    value: uptimeTracker.getCurrent(),
                    inline: true
                },
                {
                    name: "👤 Online Players",
                    value: players,
                    inline: false
                }
            )
            .setFooter({
                text: "Aternos Status Bot"
            })
            .setTimestamp();

        // Add server icon if available
        if (server.favicon) {
            embed.setThumbnail("attachment://favicon.png");
        }

        return interaction.reply({
            embeds: [embed]
        });

    }

};