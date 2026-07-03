const database = require("../database/database");
const logger = require("../utils/logger");
const { formatDuration } = require("../utils/time");

class UptimeTracker {

    constructor() {

        this.startedAt = null;
        this.totalSeconds = 0;

    }

    /**
     * Called when the Minecraft server becomes online.
     */
    start() {

        if (this.startedAt) return;

        this.startedAt = Date.now();

        logger.info("Uptime tracker started.");

    }

    /**
     * Called when the server goes offline.
     * Saves uptime into SQLite.
     */
    stop(startedAt = null) {

        const start = startedAt || this.startedAt;

        if (!start)
            return "0s";

        const seconds = Math.floor(
            (Date.now() - start) / 1000
        );

        this.totalSeconds = seconds;

        database.addUptime(seconds);

        logger.info(
            `Session uptime: ${formatDuration(seconds)}`
        );

        this.startedAt = null;

        return formatDuration(seconds);

    }

    /**
     * Current session uptime.
     */
    getCurrent() {

        if (!this.startedAt)
            return "0s";

        const seconds = Math.floor(
            (Date.now() - this.startedAt) / 1000
        );

        return formatDuration(seconds);

    }

    /**
     * Current uptime in seconds.
     */
    getSeconds() {

        if (!this.startedAt)
            return 0;

        return Math.floor(
            (Date.now() - this.startedAt) / 1000
        );

    }

    /**
     * Whether server is currently online.
     */
    isRunning() {

        return this.startedAt !== null;

    }

    /**
     * Reset tracker.
     */
    reset() {

        this.startedAt = null;
        this.totalSeconds = 0;

    }

}

module.exports = new UptimeTracker();