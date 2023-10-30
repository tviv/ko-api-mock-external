var express = require('express');
const crypto = require("crypto");
const {postCallback} = require("../utils/callback");
var router = express.Router();

router.post('/wa/api/v1/msg', (req, res) => {
  const uid = crypto.randomUUID()
  sendToCallback(req.body, uid, 'session')

  res.send({"status":"submitted","messageId":uid});
});

const sendToCallback = ({ source, destination }, uid, type) => {
  const wid = crypto.randomUUID()
  //{"app":"99digitalm972779031419n","timestamp":1698646706429,"version":2,"type":"message-event","payload":{"id":"15655c32-aab5-4abc-9735-b5753cac5822","gsId":"ab52ecd1-7181-4b6b-ba4d-06de1d3bdb42","type":"sent","destination":"79622237668","payload":{"ts":1698646700},"conversation":{"id":"398c8004d6e949b5251ce56bd2080092","expiresAt":1698732900,"type":"service"},"pricing":{"policy":"CBP","category":"service"}}}
  //{"app":"99digitalm972779031419n","timestamp":1697217409221,"version":2,"type":"message-event","payload":{"id":"f414f98b-a912-4e6b-ae92-29b356ad009e","gsId":"3ad568ff-f0cd-4dbe-a691-32bf6a1d69af","type":"sent","destination":"79622237668","payload":{"ts":1697217403},"conversation":{"id":"5eb4641c5344292b866bad7654f818b5","expiresAt":1697294520,"type":"service"},"pricing":{"policy":"CBP","category":"service"}}}
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,"type":"enqueued",destination, "payload":{"whatsappMessageId":wid,type}}},
    {from: source}
    ), 500)
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,"type":"sent",destination, "payload":{"ts":(Date.now()/1000 | 0) - 1},"conversation":{"id":"0","expiresAt":(Date.now()/1000 | 0) + 70000,"type":"service"},"pricing":{"policy":"CBP","category":"service"}}},
    {from: source}
  ), 900)
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{id:wid, gsId: uid,"type":"delivered", destination, "payload":{"ts":(Date.now()/1000 | 0) - 1}}},
    {from: source}
  ), 1600)

  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{id:wid, gsId: uid,"type":"read", destination, "payload":{"ts":(Date.now()/1000 | 0) - 1}}},
    {from: source}
  ), 1900 + getRandomInt(6000))

};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;
