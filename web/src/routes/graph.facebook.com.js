var express = require('express');
const crypto = require("crypto");
const {postRequest} = require("../utils/callback");
const {getRandomInt, getShortTS} = require("../utils/general");
const router = express.Router();
const callbackUrl = process.env.MSG_CALLBACK_URL_FB;


router.post('/:version/:phoneNumberId/messages', (req, res) => {
  const uid = crypto.randomUUID();
  //console.log('req.body', req.body);
  //console.log('req.params', req.params);

  setTimeout(() => {
    res.send({"messaging_product": "whatsapp", "contacts": [{"input": req.body.to, "wa_id": req.body.to}], "messages": [{"id": uid}]});
    sendToCallback(req.body, req.params.phoneNumberId, uid);
  }, 900);
});

const sendToCallback = ({ from, to, biz_opaque_callback_data }, phoneNumberId, uid) => {
  const statuses = ["sent", "delivered", "read"];
  const delays = [900, 1600, 1900 + getRandomInt(6000)];

  statuses.forEach((status, index) => {
    setTimeout(() => {
      console.log('sendToCallback', callbackUrl, { to, uid, status });
      postRequest( callbackUrl,
      {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "357834497404105",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "phone_number_id": phoneNumberId,
                "display_phone_number": "972779031419"
              },
              "statuses": [{
                "id": uid,
                "status": status,
                "timestamp": (Date.now() / 1000 | 0),
                "recipient_id": to,
                "biz_opaque_callback_data": biz_opaque_callback_data,
              }]
            },
            "field": "messages"
          }]
        }]
      },
      { from }
    )
  }, delays[index]);
  });
};

module.exports = router;