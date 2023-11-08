var express = require('express');
const crypto = require("crypto");
const {postCallback} = require("../utils/callback");
var router = express.Router();

router.all('*', (req, res) => {
  const details = {
    method: req.method,
    url: req.header('Origin') + req.url,
    //req.params,
    //query: req.query,
    body: Object.keys(req.body).length > 0 ? req.body : undefined,
  }
  console.log('unknown', details )

  res.send({status: 'unknown mock route', details});
});

module.exports = router;
