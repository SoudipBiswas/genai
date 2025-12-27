import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

interface Config {
  port: number;
  geminiApiKey: string;
  nodeEnv: string;
  frontendUrl: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  port: parseInt(getEnvVariable('PORT', '3001'), 10),
  geminiApiKey: getEnvVariable('GEMINI_API_KEY'),
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  frontendUrl: getEnvVariable('FRONTEND_URL', 'http://localhost:5173'),
};

// Validate critical config
if (!config.geminiApiKey || config.geminiApiKey === 'AIzaSyDnwLUB6_gBvnWFE7ICCX_HpTcQZZly54k') {
  console.error('⚠️  WARNING: GEMINI_API_KEY is not set or using placeholder value.');
  console.error('   Please add your actual API key to server/.env file');
}

export default config;
