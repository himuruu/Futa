const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const monitor = require("../monitor/serverMonitor");
const uptimeTracker = require("../monitor/uptimeTracker");
const database = require("../database/database");
const { formatDuration } = require("../utils/time");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Shows the Minecraft server uptime."),

    async execute(interaction) {

        const server = monitor.getData();
        const stats = database.getTodayStats();

        const embed = new EmbedBuilder()
            .setColor(server.online ? 0x57F287 : 0xED4245)
            .setTitle("⏱ Minecraft Server Uptime");

        // Current session
        if (server.online) {

            embed.addFields({
                name: "🟢 Current Session",
                value: uptimeTracker.getCurrent(),
                inline: true
            });

        } else {

            embed.addFields({
                name: "🔴 Current Session",
                value: "Server Offline",
                inline: true
            });

        }

        // Today's total uptime
        embed.addFields({
            name: "📅 Today's Total Uptime",
            value: formatDuration(stats.total_uptime),
            inline: true
        });

        // Today's starts
        embed.addFields({
            name: "🚀 Server Starts",
            value: `${stats.starts}`,
            inline: true
        });

        // Peak players
        embed.addFields({
            name: "👥 Peak Players Today",
            value: `${stats.peak_players}`,
            inline: true
        });

        // Joins
        embed.addFields({
            name: "➕ Total Joins",
            value: `${stats.total_joins}`,
            inline: true
        });

        // Leaves
        embed.addFields({
            name: "➖ Total Leaves",
            value: `${stats.total_leaves}`,
            inline: true
        });

        embed
            .setFooter({
                text: "Aternos Status Bot"
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }

};