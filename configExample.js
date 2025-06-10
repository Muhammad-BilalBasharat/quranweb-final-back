import { loadEnv, get, getAll, getCurrentEnv } from './envConfig.js';

// Example of how to use the environment configuration

// 1. Load a specific environment
loadEnv('development'); // or 'production' or 'test'

// 2. Get specific environment variables
const databaseUrl = get('DATABASE_URL');
const apiKey = get('API_KEY', 'default-key'); // with default value
const port = get('PORT', 3000); // with default value

// 3. Get all environment variables
const allEnvVars = getAll();

// 4. Get current environment
const currentEnvironment = getCurrentEnv();

// Example usage in a configuration object
const config = {
    database: {
        url: databaseUrl,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    server: {
        port: port,
        apiKey: apiKey
    },
    environment: currentEnvironment
};

// Example of how to use in an Express app
import express from 'express';
const app = express();

app.listen(config.server.port, () => {
    console.log(`Server running in ${config.environment} mode on port ${config.server.port}`);
    console.log('Database URL:', config.database.url);
});

// Example of how to use in a database connection
import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.database.url, config.database.options);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

// Example of how to use in an API route
app.get('/api/config', (req, res) => {
    // Only send non-sensitive configuration
    res.json({
        environment: config.environment,
        port: config.server.port
    });
}); 