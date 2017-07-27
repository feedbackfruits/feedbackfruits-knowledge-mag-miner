import { Observable } from '@reactivex/rxjs';

import { Actionable } from 'memux';
import { Miner } from 'feedbackfruits-knowledge-engine';

// import { mine } from './miner';

import {
  NAME,
  // KAFKA_ADDRESS,
  // OUTPUT_TOPIC,
} from './config';

const source = new Observable<Actionable>(observer => {

});

const miner = Miner({ name: NAME, readable: { source } });

export default miner;

// import { getPages } from './miner';
// const { send } = memux({
//   name: NAME,
//   url: KAFKA_ADDRESS,
//   output: OUTPUT_TOPIC
// });
//
// let count = 0;
// function sendQuad(quad) {
//   console.log(`Sending quad nr ${++count}`);
//   return send({ type: 'write', quad });
// }

// console.log('Starting MAG miner...');
//
// const types = [ 'Paper' ];
//
// mine(types).then(() => {
//   console.log(`Done!`);
//   return;
// }).catch(err => console.error(err));
