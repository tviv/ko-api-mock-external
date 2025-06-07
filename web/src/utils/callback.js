const axios = require("axios");

const postRequest = (url, body, query) => {
  axios.post(url, body, {params: query})
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

module.exports = { postRequest }
