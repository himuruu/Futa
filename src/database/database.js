const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "stats.sqlite")
);

// ==========================
// TABLES
// ==========================

// Server start/stop logs
db.prepare(`
CREATE TABLE IF NOT EXISTS server_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    timestamp INTEGER NOT NULL
)
`).run();

// Player joins/leaves
db.prepare(`
CREATE TABLE IF NOT EXISTS player_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT NOT NULL,
    event TEXT NOT NULL,
    timestamp INTEGER NOT NULL
)
`).run();

// Daily statistics
db.prepare(`
CREATE TABLE IF NOT EXISTS daily_stats (
    date TEXT PRIMARY KEY,
    peak_players INTEGER DEFAULT 0,
    total_joins INTEGER DEFAULT 0,
    total_leaves INTEGER DEFAULT 0,
    total_uptime INTEGER DEFAULT 0,
    starts INTEGER DEFAULT 0
)
`).run();

// ==========================
// SERVER LOGS
// ==========================

function logServer(event) {

    db.prepare(`
        INSERT INTO server_logs(event, timestamp)
        VALUES (?, ?)
    `).run(event, Date.now());

}

// ==========================
// PLAYER LOGS
// ==========================

function logPlayer(player, event) {

    db.prepare(`
        INSERT INTO player_logs(player, event, timestamp)
        VALUES (?, ?, ?)
    `).run(player, event, Date.now());

}

// ==========================
// DAILY STATS
// ==========================

function today() {

    return new Date().toISOString().split("T")[0];

}

function ensureToday() {

    db.prepare(`
        INSERT OR IGNORE INTO daily_stats(date)
        VALUES (?)
    `).run(today());

}

function incrementStarts() {

    ensureToday();

    db.prepare(`
        UPDATE daily_stats
        SET starts = starts + 1
        WHERE date = ?
    `).run(today());

}

function incrementJoins() {

    ensureToday();

    db.prepare(`
        UPDATE daily_stats
        SET total_joins = total_joins + 1
        WHERE date = ?
    `).run(today());

}

function incrementLeaves() {

    ensureToday();

    db.prepare(`
        UPDATE daily_stats
        SET total_leaves = total_leaves + 1
        WHERE date = ?
    `).run(today());

}

function addUptime(seconds) {

    ensureToday();

    db.prepare(`
        UPDATE daily_stats
        SET total_uptime = total_uptime + ?
        WHERE date = ?
    `).run(seconds, today());

}

function updatePeakPlayers(players) {

    ensureToday();

    const current = db.prepare(`
        SELECT peak_players
        FROM daily_stats
        WHERE date = ?
    `).get(today());

    if (players > current.peak_players) {

        db.prepare(`
            UPDATE daily_stats
            SET peak_players = ?
            WHERE date = ?
        `).run(players, today());

    }

}

// ==========================
// QUERIES
// ==========================

function getTodayStats() {

    ensureToday();

    return db.prepare(`
        SELECT *
        FROM daily_stats
        WHERE date = ?
    `).get(today());

}

function getRecentServerLogs(limit = 10) {

    return db.prepare(`
        SELECT *
        FROM server_logs
        ORDER BY timestamp DESC
        LIMIT ?
    `).all(limit);

}

function getRecentPlayerLogs(limit = 20) {

    return db.prepare(`
        SELECT *
        FROM player_logs
        ORDER BY timestamp DESC
        LIMIT ?
    `).all(limit);

}

// ==========================

module.exports = {

    db,

    logServer,
    logPlayer,

    incrementStarts,
    incrementJoins,
    incrementLeaves,

    addUptime,
    updatePeakPlayers,

    getTodayStats,
    getRecentServerLogs,
    getRecentPlayerLogs

};