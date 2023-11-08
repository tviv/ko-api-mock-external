function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const getShortTS = () => Date.now()/1000 | 0;

module.exports = { getRandomInt, getShortTS }
