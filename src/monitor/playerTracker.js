const database = require("../database/database");
const embeds = require("../utils/embeds");
const logger = require("../utils/logger");

class PlayerTracker {

    constructor() {

        this.previousPlayers = [];

    }

    async update(client, currentPlayers) {

        // Convert player objects to names
        const current = currentPlayers.map(player => player.name);
        const previous = this.previousPlayers;

        // Find joins
        const joined = current.filter(name => !previous.includes(name));

        // Find leaves
        const left = previous.filter(name => !current.includes(name));

        if (joined.length === 0 && left.length === 0) {
            this.previousPlayers = current;
            return;
        }

        let channel;

        try {

            channel = await client.channels.fetch(process.env.CHANNEL_ID);

        } catch (err) {

            logger.error(err);
            return;

        }

        // ==========================
        // Joined Players
        // ==========================

        for (const player of joined) {

            logger.info(`${player} joined the server.`);

            database.logPlayer(player, "JOIN");
            database.incrementJoins();

            await channel.send({
                embeds: [
                    embeds.playerJoin(player)
                ]
            });

        }

        // ==========================
        // Left Players
        // ==========================

        for (const player of left) {

            logger.info(`${player} left the server.`);

            database.logPlayer(player, "LEAVE");
            database.incrementLeaves();

            await channel.send({
                embeds: [
                    embeds.playerLeave(player)
                ]
            });

        }

        this.previousPlayers = current;

    }

    reset() {

        this.previousPlayers = [];

    }

    getPlayers() {

        return this.previousPlayers;

    }

    getCount() {

        return this.previousPlayers.length;

    }

}

module.exports = new PlayerTracker();