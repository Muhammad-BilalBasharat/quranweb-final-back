import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment files configuration
const envFiles = {
    development: '.env.development',
    production: '.env.production',
    test: '.env.test'
};

// Current environment state
let currentEnv = process.env.NODE_ENV || 'development';

/**
 * Load environment variables from the specified environment file
 * @param {string} env - The environment to load (development, production, test)
 * @returns {Object} The loaded environment variables
 */
const loadEnv = (env = currentEnv) => {
    try {
        const envFile = envFiles[env] || envFiles.development;
        const envPath = path.resolve(process.cwd(), envFile);
        
        const result = dotenv.config({ path: envPath });
        
        if (result.error) {
            throw new Error(`Error loading ${envFile}: ${result.error.message}`);
        }

        currentEnv = env;
        console.log(`Environment loaded: ${env}`);
        return process.env;
    } catch (error) {
        console.error(`Failed to load environment: ${error.message}`);
        throw error;
    }
};

/**
 * Get a specific environment variable
 * @param {string} key - The environment variable key
 * @param {*} defaultValue - Default value if the key is not found
 * @returns {*} The environment variable value
 */
const get = (key, defaultValue = null) => {
    return process.env[key] || defaultValue;
};

/**
 * Get all environment variables
 * @returns {Object} All environment variables
 */
const getAll = () => {
    return process.env;
};

/**
 * Get current environment
 * @returns {string} Current environment name
 */
const getCurrentEnv = () => {
    return currentEnv;
};

// Export the configuration functions
export {
    loadEnv,
    get,
    getAll,
    getCurrentEnv
};