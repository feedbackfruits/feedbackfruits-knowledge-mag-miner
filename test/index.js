import test from 'ava';
import nock from 'nock';
import mockFieldOfStudyPage from './support/mockFieldOfStudyPage';

import { Consumer } from 'memux';
import MAGMiner from '../lib';

nock('https://westus.api.cognitive.microsoft.com')
  .get('/academic/v1.0/evaluate?attributes=Id,FN,DFN,FC.FId,FP.FId&subscription-key=undefined&orderby=FN:asc&expr=Ty%3D%276%27&offset=0&count=100')
  .reply(200, mockFieldOfStudyPage);

test('it exists', t => {
  t.not(MAGMiner, undefined);
});

test('it should be able to connect to Kafka', t => {
  const url = 'localhost:9092';
  const name = 'test';
  const topic = 'test_quad_update_requests';

  let readCount = 0;

  return new Promise((resolve, reject) => {
    const { source } = MAGMiner();
    console.log('Waiting for miner to send quads...')
    const subscription = source.subscribe({
      next: (...args) => {
        console.log('Received quad.');
        readCount += 1;
        resolve(...args);
        subscription.unsubscribe();
      },
      error: (...args) => {
        reject(...args)
      },
      complete: (...args) => {
        reject(...args)
      }
    });
  })
  .then(() => {
    console.log('Quads received. Starting consumer...');
    return new Promise((resolve, reject) => {
      const consumer = Consumer({ url, name, topic });
      const subscription = consumer.source.subscribe({
        next: (...args) => {
          console.log('Quad read.');
          readCount += 1;
          resolve(...args);
          subscription.unsubscribe();
        },
        error: (...args) => {
          reject(...args)
        },
        complete: (...args) => {
          reject(...args)
        }
      });
    });
  })
  .then((...args) => {
    t.is(readCount, 1);
  }, (...args) => t.fail(...args));

});
