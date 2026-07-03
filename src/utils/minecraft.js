const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const logger = require('./logger');

function createFallbackStatus(host, port, source = 'fallback') {
  return {
    online: true,
    players: {
      online: 0,
      max: 0,
      sample: [],
    },
    version: {
      name: 'Unknown',
    },
    roundTripLatency: 0,
    motd: {
      clean: 'Unknown',
    },
    favicon: null,
    host,
    port,
    source,
  };
}

function probeTcpConnectivity(host, port, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy(new Error('TCP probe timed out'));
    }, timeout);

    socket.once('connect', () => {
      clearTimeout(timer);
      socket.end();
      resolve(createFallbackStatus(host, port, 'tcp'));
    });

    socket.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    socket.connect(port, host);
  });
}

function parseAternosResponse(body) {
  if (!body) {
    return null;
  }

  try {
    const parsed = JSON.parse(body);
    const online = parsed.online === true || parsed.status === 'online' || parsed.state === 'online' || parsed.running === true;
    return {
      online,
      players: {
        online: Number(parsed.players?.online ?? parsed.onlinePlayers ?? parsed.playerCount ?? 0),
        max: Number(parsed.players?.max ?? parsed.maxPlayers ?? 0),
        sample: Array.isArray(parsed.players?.sample) ? parsed.players.sample : [],
      },
      version: { name: parsed.version?.name || parsed.version || 'Unknown' },
      roundTripLatency: Number(parsed.roundTripLatency ?? 0),
      motd: { clean: parsed.motd?.clean || parsed.motd || 'Unknown' },
      favicon: parsed.favicon || null,
    };
  } catch {
    const text = body.toLowerCase();
    const online = /online|running|started/.test(text) && !/offline|stopped|not running/.test(text);
    const playersMatch = text.match(/players?\s*[:=]\s*(\d+)/i);
    const maxMatch = text.match(/max\s*[:=]\s*(\d+)/i);

    if (!online && !playersMatch && !maxMatch) {
      return null;
    }

    return {
      online,
      players: {
        online: playersMatch ? Number(playersMatch[1]) : 0,
        max: maxMatch ? Number(maxMatch[1]) : 0,
        sample: [],
      },
      version: { name: 'Unknown' },
      roundTripLatency: 0,
      motd: { clean: 'Unknown' },
      favicon: null,
    };
  }
}

function buildCookieHeader() {
  const cookies = [process.env.ATERNOS_SESSION_COOKIE, process.env.ATERNOS_SERVER_COOKIE].filter(Boolean);
  return cookies.length > 0 ? cookies.join('; ') : undefined;
}

function requestUrl(url, timeout) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const headers = {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json,text/html,*/*',
    };

    const cookieHeader = buildCookieHeader();
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const req = client.get(url, { headers, timeout }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body,
        });
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Aternos request timed out'));
    });

    req.on('error', reject);
  });
}

async function getMinecraftStatus(host, port, timeout = 5000) {
  const statusUrl = process.env.ATERNOS_STATUS_URL;
  const candidateUrls = [];

  if (statusUrl) {
    candidateUrls.push(statusUrl);
  }

  if (process.env.ATERNOS_SESSION_COOKIE && process.env.ATERNOS_SERVER_COOKIE) {
    candidateUrls.push(`https://aternos.org/ping/${encodeURIComponent(host)}`);
    candidateUrls.push(`https://aternos.org/api/server/${encodeURIComponent(host)}`);
    candidateUrls.push(`https://aternos.org/server/${encodeURIComponent(host)}/status`);
    candidateUrls.push(`https://aternos.org/server/${encodeURIComponent(host)}`);
  }

  for (const url of candidateUrls) {
    try {
      const response = await requestUrl(url, timeout);
      if (response.statusCode >= 200 && response.statusCode < 400 && response.body) {
        const parsed = parseAternosResponse(response.body);
        if (parsed) {
          return {
            ...parsed,
            host,
            port,
            source: 'aternos-cookies',
          };
        }
      }
    } catch (error) {
      logger.warn(`Aternos status request failed for ${url}: ${error.message}`);
    }
  }

  try {
    return await probeTcpConnectivity(host, port, Math.min(timeout, 3000));
  } catch (probeError) {
    throw probeError;
  }
}

module.exports = {
  getMinecraftStatus,
};
