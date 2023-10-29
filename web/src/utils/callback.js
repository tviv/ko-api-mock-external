const axios = require("axios");
require('dotenv').config({path: '../.env'})

const callbackUrl = process.env.MSG_CALLBACK_URL
const postCallback = (body, query) => {
  axios.post(callbackUrl, body, {params: query})
}

module.exports = { postCallback }
