const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ip")
        .setDescription("Shows the Minecraft server address."),

    async execute(interaction) {

        const host = process.env.HOST;
        const javaPort = process.env.PORT || "25565";
        const bedrockPort = process.env.BEDROCK_PORT;

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🌍 Minecraft Server IP")
            .setDescription(
                "Use the following address to join the server."
            )
            .addFields(
                {
                    name: "🖥 Java Edition",
                    value:
                        `**Address**\n\`${host}:${javaPort}\``,
                    inline: false
                }
            )
            .setFooter({
                text: "Copy the address above into Minecraft"
            })
            .setTimestamp();

        if (bedrockPort) {

            embed.addFields({
                name: "📱 Bedrock Edition",
                value:
                    `**Address**\n\`${host}:${bedrockPort}\``,
                inline: false
            });

        }

        await interaction.reply({
            embeds: [embed]
        });

    }

};