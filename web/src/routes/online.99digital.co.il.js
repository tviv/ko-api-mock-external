var express = require('express');
const crypto = require("crypto");
const {getShortTS, getRandomInt} = require("../utils/general");
var router = express.Router();

router.post('/api/v1/accounts/:account_id/conversations/:conversation_id/messages', (req, res) => {
  //console.log('req.body', req.body);
  const result = {
    "id": 300000000 + getRandomInt(10000000),
    "content": req.body.content,
    "inbox_id": 100 + getRandomInt(1000),
    "conversation_id": parseInt(req.params.conversation_id),
    "message_type": 0,
    "content_type": "text",
    "status": "sent",
    "content_attributes": {},
    "created_at": getShortTS(),
    "private": false,
    "source_id": null,
    "sender": {
      "custom_attributes": {},
      "email": null,
      "id": 200000 + getRandomInt(100000),
      "identifier": null,
      "name": "test contact",
      "phone_number": "+1234567891",
      "thumbnail": "",
      "type": "contact"
    },
  }

  res.send(result);
});

router.post('/api/v1/accounts/:account_id/conversations/by_phone_number', (req, res) => {
  //console.log('req.body', req.body);
  const result = {
    "contact_id": 10000000 + getRandomInt(1000000),
    "conversation_id": 2000000 + getRandomInt(100000),
  }

  res.send(result);
});

router.post('/api/v1/accounts/:account_id/conversations/:conversation_id/messages/:message_id/status', (req, res) => {
  //console.log('req.body', req.body);
  const result = {
    "id": parseInt(req.params.message_id),
    "conversation_id": parseInt(req.params.conversation_id),
    "status": req.body.status,
  }

  res.send(result);
});


module.exports = router;
