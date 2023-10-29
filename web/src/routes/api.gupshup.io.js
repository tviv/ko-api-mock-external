var express = require('express');
const crypto = require("crypto");
const {postCallback} = require("../utils/callback");
var router = express.Router();

router.post('/wa/api/v1/msg', (req, res, next) => {
  const { source, destination } = req.body
  const uid = crypto.randomUUID()
  sendToCallback(req.body, uid, 'session')

  res.send({"status":"submitted","messageId":uid});
});

const sendToCallback = ({ source, destination }, uid, type) => {
  const gsId = crypto.randomUUID()

  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":gsId,"type":"enqueued",destination, "payload":{"whatsappMessageId":uid,type}}},
    {from: source}
    ), 500)
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,gsId,"type":"delivered", destination, "payload":{"ts":(Date.now()/1000 | 0) - 1}}},
    {from: source}
  ), 1600)

  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,gsId,"type":"read", destination, "payload":{"ts":(Date.now()/1000 | 0) - 1}}},
    {from: source}
  ), 1900 + getRandomInt(5000))

};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;
