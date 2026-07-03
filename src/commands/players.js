const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const monitor = require("../monitor/serverMonitor");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("players")
        .setDescription("Shows all online Minecraft players."),

    async execute(interaction) {

        const server = monitor.getData();

        if (!server.online) {

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("🔴 Server Offline")
                .setDescription(
                    "The Minecraft server is currently offline."
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        }

        const playerList = server.playerList || [];

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("👥 Online Players")
            .setDescription(
                playerList.length
                    ? playerList
                        .map((player, index) => `**${index + 1}.** ${player.name}`)
                        .join("\n")
                    : "No players are currently online."
            )
            .addFields(
                {
                    name: "Players",
                    value: `${server.players}/${server.maxPlayers}`,
                    inline: true
                },
                {
                    name: "Version",
                    value: server.version,
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

};