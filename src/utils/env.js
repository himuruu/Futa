const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const logger = require('./logger');

function loadEnvironment(options = {}) {
  const cwd = options.cwd || path.resolve(__dirname, '..', '..');
  const envPath = options.envPath || path.join(cwd, '.env');
  const examplePath = options.examplePath || path.join(cwd, '.env.example');

  const envResult = dotenv.config({
    path: envPath,
    override: false,
  });

  if (fs.existsSync(examplePath)) {
    const exampleConfig = dotenv.parse(fs.readFileSync(examplePath, 'utf8'));

    for (const [key, value] of Object.entries(exampleConfig)) {
      if (!process.env[key] || process.env[key] === '') {
        process.env[key] = value;
      }
    }
  }

  if (envResult.error) {
    if (fs.existsSync(examplePath)) {
      logger.warn('No .env file found. Using values from .env.example.');
    } else {
      logger.warn('No .env or .env.example file found. Set the required environment variables before starting the bot.');
    }
  }

  return process.env;
}

module.exports = {
  loadEnvironment,
};
