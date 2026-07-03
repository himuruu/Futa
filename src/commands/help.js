const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all available commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("📖 Aternos Status Bot")
            .setDescription(
                "A Discord bot for monitoring your Minecraft server."
            )
            .addFields(
                {
                    name: "🖥 Server Commands",
                    value:
                        "`/status` - Show server status\n" +
                        "`/ip` - Show server IP\n" +
                        "`/players` - Show online players\n" +
                        "`/uptime` - Show server uptime",
                    inline: false
                },
                {
                    name: "📊 Information",
                    value:
                        "`/ping` - Show bot & server latency\n" +
                        "`/help` - Show this help menu",
                    inline: false
                },
                {
                    name: "✨ Features",
                    value:
                        "• Live online/offline monitoring\n" +
                        "• Player join/leave notifications\n" +
                        "• Automatic status updates\n" +
                        "• Uptime tracking\n" +
                        "• SQLite statistics\n" +
                        "• Java & Bedrock support",
                    inline: false
                }
            )
            .setFooter({
                text: "Version 1.0.0"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};