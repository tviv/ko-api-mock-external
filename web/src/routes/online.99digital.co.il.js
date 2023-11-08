var express = require('express');
const crypto = require("crypto");
const {postCallback} = require("../utils/callback");
const {getShortTS, getRandomInt} = require("../utils/general");
var router = express.Router();

router.post('/api/v1/accounts/60/conversations/:conversation_id/messages', (req, res) => {

  const result = {
    "id": 30000000 + getRandomInt(1000000),
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
      "id": 107854,
      "identifier": null,
      "name": "sdfdffgd",
      "phone_number": "+1234567891",
      "thumbnail": "",
      "type": "contact"
    },
  }

  res.send(result);
});


module.exports = router;
