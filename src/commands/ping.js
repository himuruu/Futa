const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const monitor = require("../monitor/serverMonitor");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot and Minecraft server latency."),

    async execute(interaction) {

        const sent = await interaction.reply({
            content: "🏓 Measuring latency...",
            fetchReply: true
        });

        const botPing = sent.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);

        const server = monitor.getData();

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🏓 Ping Information")
            .addFields(
                {
                    name: "🤖 Bot Latency",
                    value: `${botPing} ms`,
                    inline: true
                },
                {
                    name: "🌐 Discord API",
                    value: `${apiPing} ms`,
                    inline: true
                },
                {
                    name: "🎮 Minecraft Server",
                    value: server.online
                        ? `${server.ping} ms`
                        : "Offline",
                    inline: true
                }
            )
            .setFooter({
                text: "Aternos Status Bot"
            })
            .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed]
        });

    }

};