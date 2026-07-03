const logger = require("../utils/logger");
const time = require("../utils/time");

class ChannelUpdater {

    constructor() {

        this.lastStatusName = "";
        this.lastPlayerName = "";

    }

    async update(client, serverData) {

        if (!client) return;

        try {

            if (process.env.UPTIME_CHANNEL_ID && serverData.startedAt) {

    const uptimeChannel = await client.channels.fetch(
        process.env.UPTIME_CHANNEL_ID
    );

    if (uptimeChannel) {

        const seconds =
            (Date.now() - serverData.startedAt) / 1000;

        const newName =
            `⏱・${time.formatDuration(seconds)}`;

        if (uptimeChannel.name !== newName) {

            await uptimeChannel.setName(newName);

        }

    }

}

            // -----------------------
            // Status Channel
            // -----------------------

            if (process.env.STATUS_CHANNEL_ID) {

                const statusChannel = await client.channels.fetch(
                    process.env.STATUS_CHANNEL_ID
                );

                if (statusChannel) {

                    const newName = serverData.online
                        ? "🟢・online"
                        : "🔴・offline";

                    if (
                        newName !== this.lastStatusName &&
                        statusChannel.name !== newName
                    ) {

                        await statusChannel.setName(newName);

                        this.lastStatusName = newName;

                        logger.info(
                            `Updated status channel -> ${newName}`
                        );

                    }

                }

            }

            // -----------------------
            // Player Count Channel
            // -----------------------

            if (process.env.PLAYER_CHANNEL_ID) {

                const playerChannel = await client.channels.fetch(
                    process.env.PLAYER_CHANNEL_ID
                );

                if (playerChannel) {

                    const newName =
                        `👥・${serverData.players}-${serverData.maxPlayers}`;

                    if (
                        newName !== this.lastPlayerName &&
                        playerChannel.name !== newName
                    ) {

                        await playerChannel.setName(newName);

                        this.lastPlayerName = newName;

                        logger.info(
                            `Updated player channel -> ${newName}`
                        );

                    }

                }

            }

        }

        catch (err) {

            logger.error(err);

        }

    }

}

module.exports = new ChannelUpdater();