const PQueue = require('p-queue');

const queue = new PQueue({
  concurrency: 16
});

export default queue;
