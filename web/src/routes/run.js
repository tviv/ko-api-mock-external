const express = require('express');
const router = express.Router();
const axios = require('axios');

// Serve the /run page
router.get('/', (req, res) => {
    res.send(`
        <h2>Run Parallel Requests</h2>
        <form id="runForm" onsubmit="return false;" style="margin-bottom: 20px;">
            <label>Number of Requests: <input type="number" id="count" min="1" value="10" required></label>
            <button type="button" onclick="runRequests()">Run</button>
        </form>
        <div id="status"></div>
        <script>
        async function runRequests() {
            const count = parseInt(document.getElementById('count').value, 10);
            if (!count || count < 1) return;
            document.getElementById('status').innerHTML = '<b>In progress...</b>';
            const res = await fetch('/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count })
            });
            const data = await res.json();
            document.getElementById('status').innerHTML =
                '<b>Done!</b><br>' +
                'Sent <b>' + data.sent + '</b> requests ' //+ in <b>' + data.elapsed.toFixed(2) + 's</b>.<br>' +
                //'RPS: <b>' + data.rps + '</b><br>'
                ;
        }
        </script>
    `);
});

// Handle the POST to /run to send requests from backend
router.post('/', (req, res) => {
    let count = parseInt(req.body.count, 10) || 0;
    if (count < 1) return res.status(400).json({ error: 'Invalid count' });
    const baseUrl = process.env.TEST_API_DOMAIN || '';
    let sent = 0;
    const promises = [];
    const start = Date.now();

    // Fire off all requests as fast as possible, do not await
    while (sent < count) {
        const phone = 12340000000 + sent;
        promises.push(
            axios.post(baseUrl + '/whatsapp/v2/sendTemplate', {
                apiKey: '6cea6662-14e2-4ba2-9763-5bfa9b60f979',
                from: '972779031419',
                to: String(phone),
                name: 'start_conversation',
                language: 1,
                headerType: 1,
                bodyVariable1: '11',
                bodyVariable2: '22',
            },{
            headers: {
                'Connection': 'keep-alive'
            }
        })
        .catch((error) => {
                // Log bad responses with bodies
                if (error.response) {
                    console.log(`Bad response for phone ${phone}:`, {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    });
                } else if (error.request) {
                    console.log(`No response received for phone ${phone}:`, error.message);
                } else {
                    console.log(`Request error for phone ${phone}:`, error.message);
                }
            })
        );
        sent++;
    }
    const elapsed = (Date.now() - start) / 1000;
    const rps = elapsed > 0 ? (count / elapsed).toFixed(2) : 'N/A';

    // Respond immediately after all requests are fired off
    res.json({ sent: count, elapsed, rps, message: 'All requests sent (not waited for responses).' });

    // Optionally, log when all responses are done
    Promise.all(promises).then(() => {
        console.log(`All ${count} requests completed (responses received).`);
    });
});

module.exports = router;
