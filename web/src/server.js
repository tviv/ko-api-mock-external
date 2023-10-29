const os = require('os');
const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {

  console.log('req', req.url)

  next();
});

app.use('/api.gupshup.io', require('./routes/api.gupshup.io'))
//app.use('/', require('./routes/api.gupshup.io'))


app.get('/', function(req, res) {
    redisClient.get('numVisits', function(err, numVisits) {
        numVisitsToDisplay = parseInt(numVisits) + 1;
        if (isNaN(numVisitsToDisplay)) {
            numVisitsToDisplay = 1;
        }
       res.send(os.hostname() +': Number of visits is: ' + numVisitsToDisplay);
        numVisits++;
        redisClient.set('numVisits', numVisits);
    });
});

app.listen(5011, function() {
    console.log('Web application is listening on port 5000');
});
