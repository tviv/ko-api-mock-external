var express = require('express');
const crypto = require("crypto");
const {postCallback} = require("../utils/callback");
const {getRandomInt, getShortTS} = require("../utils/general");
var router = express.Router();

router.post('/wa/api/v1/msg', (req, res) => {
  const uid = crypto.randomUUID()
  sendToCallback(req.body, uid, 'session')

  setTimeout(()=>{
    sendToCallback(req.body, uid, 'session')
    res.send({"status":"submitted","messageId":uid})
  }, 900);
});

router.post('/sm/api/v1/template/msg', (req, res) => {
  const uid = crypto.randomUUID()

  setTimeout(()=>{
    sendToCallback(req.body, uid, 'template')
    res.send({"status":"submitted","messageId":uid})
  }, 1500);
});

const sendToCallback = ({ source, destination }, uid, type) => {
  const wid = crypto.randomUUID()
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,"type":"enqueued",destination, "payload":{"whatsappMessageId":wid,type}}},
    {from: source}
    ), 500)
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{"id":uid,"type":"sent",destination, "payload":{"ts":(Date.now()/1000 | 0) - 1},"conversation":{"id":"0","expiresAt":(Date.now()/1000 | 0) + 70000,"type":"service"},"pricing":{"policy":"CBP","category":"service"}}},
    {from: source}
  ), 900)
  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{id:wid, gsId: uid,"type":"delivered", destination, "payload":{"ts":getShortTS() - 1}}},
    {from: source}
  ), 1600)

  setTimeout(() => postCallback(
    {"app":`99digitalm${source}n`,"timestamp":Date.now(),"version":2,"type":"message-event","payload":{id:wid, gsId: uid,"type":"read", destination, "payload":{"ts":(Date.now()/1000 | 0) - 1}}},
    {from: source}
  ), 1900 + getRandomInt(6000))

};

module.exports = router;
