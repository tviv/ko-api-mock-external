const os = require('os');
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
});
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log('req', req.url)
  next();
});

// Middleware to track request statistics
app.use((req, res, next) => {
    // Exclude /stats and /unknown routes from being tracked
    if (req.url.startsWith('/stats') || req.url.startsWith('/run') || req.url.startsWith('/unknown')) {
        return next();
    }
  
    const urlParts = req.url.split('/').filter(Boolean); // Split URL into parts and remove empty strings
    const firstPath = urlParts[0] || '/'; // First path segment
    const lastPath = urlParts[urlParts.length - 1] || '/'; // Last path segment
    const key = `${firstPath}/.../${lastPath}`; // Format: "first/.../last"
  
    const currentTime = new Date().toISOString(); // Current timestamp

    redisClient.hincrby('requestStats', key, 1, (err) => {
        if (err) {
            console.error('Error updating request stats:', err);
        }
    });

    // Per-type start time
    redisClient.setnx(`requestStats:${key}:startTime`, currentTime, (err) => {
        if (err) {
            console.error('Error setting per-type start time:', err);
        }
    });

    // Per-type end time
    redisClient.set(`requestStats:${key}:endTime`, currentTime, (err) => {
        if (err) {
            console.error('Error setting per-type end time:', err);
        }
    });
  
    // Set the global start time if it doesn't exist
    redisClient.setnx('requestStats:startTime', currentTime, (err) => {
        if (err) {
            console.error('Error setting start time:', err);
        }
    });

    // Update the global end time
    redisClient.set('requestStats:endTime', currentTime, (err) => {
        if (err) {
            console.error('Error setting end time:', err);
        }
    });
  
    next();
});

app.use('/graph.facebook.com', require('./routes/graph.facebook.com'))
app.use('/api.gupshup.io', require('./routes/api.gupshup.io'))
app.use('/online.99digital.co.il', require('./routes/online.99digital.co.il'))
app.use('/unknown', require('./routes/unknown'))

// Mount /stats router
app.use('/stats', require('./routes/stats')(redisClient));
app.use('/run', require('./routes/run'));

const server = app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});
server.setTimeout(15 * 60 * 1000); // 15 minutes
