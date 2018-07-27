import test from 'ava';
import nock from 'nock';
import mockFieldOfStudyPage from './support/mockFieldOfStudyPage';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

nock('https://westus.api.cognitive.microsoft.com')
  .get(`/academic/v1.0/evaluate?attributes=Id,FN,DFN,FC.FId,FP.FId,FL,RF&subscription-key=undefined&orderby=FN:asc&expr=Ty%3D%276%27&offset=${(START_PAGE - 1) * PAGE_SIZE}&count=${PAGE_SIZE}`)
  .reply(200, mockFieldOfStudyPage)

// nock('https://westus.api.cognitive.microsoft.com')
  .get(`/academic/v1.0/evaluate?attributes=Id,FN,DFN,FC.FId,FP.FId,FL,RF&subscription-key=undefined&orderby=FN:asc&expr=Ty%3D%276%27&offset=${(START_PAGE) * PAGE_SIZE}&count=${PAGE_SIZE}`)
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
      if ([].concat(message.data["@type"]).find(type => type === "FieldOfStudy")) _resolve(message);
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

    // Do not await init
    init({
      name: NAME,
    });

    const result = await resultPromise;
    console.log('Result data:', JSON.stringify(result.data));
    return t.deepEqual(result, {
      action: 'write',
      data: {
        "@id": "http://academic.microsoft.com/#/detail/75678561",
        "@type": "FieldOfStudy",
        "parentFieldOfStudy": [
          "http://academic.microsoft.com/#/detail/15032970"
        ],
        "relatedFieldOfStudy": [
          "http://academic.microsoft.com/#/detail/93253208",
          "http://academic.microsoft.com/#/detail/83931994",
          "http://academic.microsoft.com/#/detail/82178898",
          "http://academic.microsoft.com/#/detail/71968016",
          "http://academic.microsoft.com/#/detail/2781297070",
          "http://academic.microsoft.com/#/detail/2780141751",
          "http://academic.microsoft.com/#/detail/2779426146",
          "http://academic.microsoft.com/#/detail/2777936497",
          "http://academic.microsoft.com/#/detail/2777185347",
          "http://academic.microsoft.com/#/detail/2776620479",
          "http://academic.microsoft.com/#/detail/2776018380",
          "http://academic.microsoft.com/#/detail/22958824",
          "http://academic.microsoft.com/#/detail/184773241",
          "http://academic.microsoft.com/#/detail/183120905",
          "http://academic.microsoft.com/#/detail/174803393",
          "http://academic.microsoft.com/#/detail/173886181",
          "http://academic.microsoft.com/#/detail/151799858",
          "http://academic.microsoft.com/#/detail/142783945",
          "http://academic.microsoft.com/#/detail/134534956",
          "http://academic.microsoft.com/#/detail/116840530"
        ],
        "fieldLevel": 5,
        "name": "0-10 V lighting control",
        "sameAsEntity": [
          "http://dbpedia.org/resource/0-10_V_lighting_control"
        ]
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
