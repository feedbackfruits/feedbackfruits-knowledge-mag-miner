import test from 'ava';
import nock from 'nock';
import mockFieldOfStudyPage from './support/mockFieldOfStudyPage';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

nock('https://westus.api.cognitive.microsoft.com')
  .get(`/academic/v1.0/evaluate?attributes=Id,FN,DFN,FC.FId,FP.FId&subscription-key=undefined&orderby=FN:asc&expr=Ty%3D%276%27&offset=${(START_PAGE - 1) * PAGE_SIZE}&count=${PAGE_SIZE}`)
  .reply(200, mockFieldOfStudyPage);

test('it exists', t => {
  t.not(init, undefined);
});

test('it works', async (t) => {
  try {
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      _resolve(message);
    };

    await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: OUTPUT_TOPIC,
      receive,
      options: {
        concurrency: 1
      }
    });

    await init({
      name: NAME,
    });

    const result = await resultPromise;
    console.log('Result data:', result.data);
    return t.deepEqual(result, {
      action: 'write',
      data: {
        '@id': 'http://academic.microsoft.com/#/detail/75678561',
        'http://schema.org/name': [
          '0-10 V lighting control',
        ],
        'http://schema.org/sameAs': [
          '<http://dbpedia.org/resource/0-10_V_lighting_control>',
        ],
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
          '<http://academic.microsoft.com/FieldOfStudy>',
        ],
      },
      key: 'http://academic.microsoft.com/#/detail/75678561',
      label: NAME,
    });
  } catch(e) {
    console.error(e);
    throw e;
  }
});

// test('it should be able to connect to Kafka', t => {
//   const url = 'localhost:9092';
//   const name = 'test';
//   const topic = 'test_update_requests';
//
//   let readCount = 0;
//
//   return new Promise((resolve, reject) => {
//     const { source } = MAGMiner({});
//     console.log('Waiting for miner to send quads...')
//     const subscription = source.subscribe({
//       next: (...args) => {
//         console.log('Received quad.');
//         readCount += 1;
//         resolve(...args);
//         subscription.unsubscribe();
//       },
//       error: (...args) => {
//         reject(...args)
//       },
//       complete: (...args) => {
//         reject(...args)
//       }
//     });
//   })
//   .then(() => {
//     console.log('Quads received. Starting consumer...');
//     return new Promise((resolve, reject) => {
//       const consumer = Consumer({ url, name, topic });
//       const subscription = consumer.source.subscribe({
//         next: (...args) => {
//           console.log('Quad read.');
//           readCount += 1;
//           resolve(...args);
//           subscription.unsubscribe();
//         },
//         error: (...args) => {
//           reject(...args)
//         },
//         complete: (...args) => {
//           reject(...args)
//         }
//       });
//     });
//   })
//   .then((...args) => {
//     t.is(readCount, 1);
//   }, (...args) => t.fail(...args));
//
// });
