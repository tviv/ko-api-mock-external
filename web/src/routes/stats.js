const express = require('express');
const router = express.Router();
const axios = require('axios');

module.exports = function(redisClient) {
    // Route to display statistics
    router.get('/', async function(req, res) {
        redisClient.hgetall('requestStats', async function(err, stats) {
            if (err) {
                return res.status(500).send('Error retrieving statistics');
            }

            const keys = Object.keys(stats || {});
            const multi = redisClient.multi();

            // Queue per-type start/end time gets
            keys.forEach(key => {
                multi.mget([`requestStats:${key}:startTime`, `requestStats:${key}:endTime`]);
            });

            // Also get global times
            multi.mget(['requestStats:startTime', 'requestStats:endTime']);

            multi.exec(async (err, replies) => {
                if (err) {
                    return res.status(500).send('Error retrieving timestamps');
                }

                let statsHtml = '';
                keys.forEach((key, idx) => {
                    const [startTime, endTime] = replies[idx] || [];
                    const count = stats[key];
                    let duration = 'N/A', rps = 'N/A';
                    if (startTime && endTime) {
                        const start = new Date(startTime).getTime();
                        const end = new Date(endTime).getTime();
                        duration = ((end - start) / 1000).toFixed(2);
                        rps = (duration > 0 ? (count / duration).toFixed(2) : count);
                    }
                    statsHtml += `<li>${key}: <strong>${count}</strong> requests, Duration: ${duration}s, RPS: ${rps}</li>`;
                });

                // Global times
                const [globalStart, globalEnd] = replies[replies.length - 1] || [];
                let globalDuration = 'N/A';
                let globalStartTimestamp = '';
                if (globalStart && globalEnd) {
                    const start = new Date(globalStart).getTime();
                    const end = new Date(globalEnd).getTime();
                    globalDuration = ((end - start) / 1000).toFixed(2);
                    globalStartTimestamp = Math.floor(start / 1000); // UNIX timestamp in seconds
                }

                // Prepare variables for API call
                const apiKey = process.env.SQL_STATS_API_KEY || 'o62ybODo9w3K';
                const phone = process.env.PHONE || '972779031419';
                let robotHistoryCount = '';
                let robotOnlineCount = '';
                let apiError = '';

                // Only call external API if we have a globalStartTimestamp, apiKey, and phone
                if (globalStartTimestamp && apiKey && phone) {
                    try {
                        const apiUrl = `https://apidev.99digital.co.il/testStatsHistoryAndOnlneTable?apikey=${encodeURIComponent(apiKey)}&phone=${encodeURIComponent(phone)}&timestamp=${globalStartTimestamp - 3}`;
                        const apiRes = await axios.get(apiUrl, {
                            headers: {
                                'x-api-key': process.env.X_API_KEY
                            }
                        });
                        if (apiRes.data && apiRes.data.status === "OK") {
                            robotHistoryCount = apiRes.data.robot_history_count;
                            robotOnlineCount = apiRes.data.robot_online_count;
                        } else {
                            apiError = 'API returned error';
                        }
                    } catch (e) {
                        apiError = 'API request failed';
                    }
                }

                res.send(`
                    <h2>Request Statistics</h2>
                    <p><strong>Global Start Time:</strong> ${globalStart || 'N/A'}</p>
                    <p><strong>Global End Time:</strong> ${globalEnd || 'N/A'}</p>
                    <p><strong>Global Duration:</strong> ${globalDuration} seconds</p>
                    <ul>
                        ${statsHtml}
                    </ul>
    
                    <div style="margin-top: 20px;">
                        <h2>External Stats</h2>
                        ${
                            (robotHistoryCount !== '' && robotOnlineCount !== '')
                            ? `<p>robot_history_count: <strong>${robotHistoryCount}</strong></p>
                               <p>robot_online_count: <strong>${robotOnlineCount}</strong></p>`
                            : apiError ? `<p style="color:red;">${apiError}</p>` : '<p>No data</p>'
                        }
                    </div>

                    <div style="display: flex; align-items: center; gap: 10px;">
                        <form method="GET" action="/stats" style="margin: 0;">
                            <button type="submit">Refresh</button>
                        </form>
                        <form method="POST" action="/stats" style="margin: 0;">
                            <button type="submit" style="border: none; background: none; cursor: pointer; padding: 0;">
                                <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="Clear" width="20" height="20" />
                            </button>
                        </form>
                    </div>
                `);
            });
        });
    });

    // Route to clear statistics
    router.post('/', function(req, res) {
        console.log('Clearing statistics');
        // Remove all per-type and global stats
        redisClient.keys('requestStats*', (err, keys) => {
            if (err) {
                return res.status(500).send('Error clearing statistics');
            }
            if (keys.length === 0) {
                return res.redirect('/stats');
            }
            redisClient.del(keys, (err) => {
                if (err) {
                    return res.status(500).send('Error clearing statistics');
                }
                res.redirect('/stats');
            });
        });
    });

    return router;
};
