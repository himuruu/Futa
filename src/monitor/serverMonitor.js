const {
    ActivityType
} = require("discord.js");

const util = require("minecraft-server-util");

const embeds = require("../utils/embeds");
const logger = require("../utils/logger");
const database = require("../database/database");

const playerTracker = require("./playerTracker");
const channelUpdater = require("./channelUpdater");
const uptimeTracker = require("./uptimeTracker");

class ServerMonitor {

    constructor() {

        this.client = null;

        this.interval = null;

        this.isOnline = false;

        this.lastStatus = false;

        this.serverData = {

            online: false,

            players: 0,

            maxPlayers: 0,

            version: "Unknown",

            ping: 0,

            motd: "Unknown",

            favicon: null,

            playerList: [],

            startedAt: null

        };

    }

    async start(client) {

        this.client = client;

        logger.info("Starting Minecraft monitor...");

        await this.check();

        this.interval = setInterval(async () => {

            await this.check();

        }, 30000);

    }

    stop() {

        if (this.interval)
            clearInterval(this.interval);

    }

    async check() {

        try {

            const status = await util.status(
                process.env.HOST,
                {
                    port: Number(process.env.PORT),
                    timeout: 5000
                }
            );

            this.serverData = {

                online: true,

                players: status.players.online,

                maxPlayers: status.players.max,

                version: status.version.name,

                ping: status.roundTripLatency,

                motd: status.motd.clean,

                favicon: status.favicon,

                playerList: status.players.sample ?? [],

                startedAt: this.serverData.startedAt || Date.now()

            };

            database.updatePeakPlayers(
                this.serverData.players
            );

            if (!this.lastStatus) {

                await this.serverOnline();

            }

            this.lastStatus = true;

            await playerTracker.update(
                this.client,
                this.serverData.playerList
            );

            await channelUpdater.update(
                this.client,
                this.serverData
            );

            this.updatePresence();

        }

        catch (err) {

            if (this.lastStatus) {

                await this.serverOffline();

            }

            this.lastStatus = false;

            this.serverData.online = false;

            this.serverData.players = 0;

            this.serverData.playerList = [];

            this.updatePresence();

        }

    }

    async serverOnline() {

        logger.info("Minecraft server is ONLINE.");

        database.logServer("ONLINE");

        database.incrementStarts();

        uptimeTracker.start();

        this.serverData.startedAt = Date.now();

        const channel =
            await this.client.channels.fetch(
                process.env.CHANNEL_ID
            );

        if (!channel) return;

        await channel.send({

            content:
                process.env.ROLE_ID
                    ? `<@&${process.env.ROLE_ID}>`
                    : undefined,

            embeds: [

                embeds.success(
                    "🟢 Server Online",
                    "The Minecraft server is now online!"
                )
                .addFields(

                    {
                        name: "Players",
                        value:
                            `${this.serverData.players}/${this.serverData.maxPlayers}`,
                        inline: true
                    },

                    {
                        name: "Version",
                        value: this.serverData.version,
                        inline: true
                    },

                    {
                        name: "Latency",
                        value:
                            `${this.serverData.ping} ms`,
                        inline: true
                    }

                )

            ]

        });

    }

    async serverOffline() {

        logger.warn("Minecraft server went OFFLINE.");

        database.logServer("OFFLINE");

        const uptime = uptimeTracker.stop();

        const channel =
            await this.client.channels.fetch(
                process.env.CHANNEL_ID
            );

        if (!channel) return;

        await channel.send({

            embeds: [

                embeds.error(
                    "🔴 Server Offline",
                    "The Minecraft server has stopped."
                )
                .addFields({

                    name: "Session Uptime",

                    value: uptime,

                    inline: true

                })

            ]

        });

    }

    updatePresence() {

        if (!this.client) return;

        if (this.serverData.online) {

            this.client.user.setPresence({

                status: "online",

                activities: [

                    {

                        name:
                            `${this.serverData.players}/${this.serverData.maxPlayers} Players`,

                        type: ActivityType.Watching

                    }

                ]

            });

        }

        else {

            this.client.user.setPresence({

                status: "idle",

                activities: [

                    {

                        name: "Server Offline",

                        type: ActivityType.Watching

                    }

                ]

            });

        }

    }

    getData() {

        return this.serverData;

    }

}

module.exports = new ServerMonitor();