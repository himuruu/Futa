const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');
const http = require('node:http');
const { getMinecraftStatus } = require('../src/utils/minecraft');

test('getMinecraftStatus reports online when the TCP port is reachable', async () => {
  const server = net.createServer((socket) => {
    socket.end();
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  try {
    const result = await getMinecraftStatus('127.0.0.1', address.port, 1000);
    assert.equal(result.online, true);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});

test('getMinecraftStatus uses cookie-based status endpoints when configured', async () => {
  const server = http.createServer((req, res) => {
    assert.equal(req.headers.cookie, 'session=abc123; server=xyz789');
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ online: true, players: { online: 7, max: 20 } }));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const originalEnv = { ...process.env };

  try {
    process.env.ATERNOS_STATUS_URL = `http://127.0.0.1:${address.port}/status`;
    process.env.ATERNOS_SESSION_COOKIE = 'session=abc123';
    process.env.ATERNOS_SERVER_COOKIE = 'server=xyz789';

    const result = await getMinecraftStatus('example.test', 25565, 1000);
    assert.equal(result.online, true);
    assert.equal(result.players.online, 7);
  } finally {
    process.env = originalEnv;
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});
