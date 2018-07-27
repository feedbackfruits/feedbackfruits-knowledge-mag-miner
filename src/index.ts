import { Observable, Subscription } from '@reactivex/rxjs';

import { Operation } from 'memux';
import { Miner, Config as _Config, Helpers } from 'feedbackfruits-knowledge-engine';

import { mine } from './miner';

import * as Config from './config';


export type MinerConfig = {
  name: string
}

export default async function init({ name }: MinerConfig) {
  console.log('Starting MAG miner');
  const send = await Miner({ name, customConfig: Config as any as typeof _Config.Base });
  const docs = mine('FieldOfStudy');

  let count = 0;
  await new Promise((resolve, reject) => {
    docs.subscribe({
      next: (doc) => {
        count++;
        console.log('Sending doc:', doc['@id']);
        return send({ action: 'write', key: doc['@id'], data: doc });
      },
      error: (reason) => {
        console.log('Miner crashed...');
        console.error(reason);
        reject(reason);
      },
      complete: () => {
        console.log('Miner completed');
        resolve();
      }
    });
  });

  console.log(`Mined ${count} docs from MAG`);
  return;



  // return mine('FieldOfStudy')
  //   .map(doc => ({ action: 'write', key: doc['@id'], data: doc }))
  //   .subscribe({
  //     next: operation => {
  //       console.log('Sending operation:', operation);
  //       return send(operation as any);
  //     },
  //     error: (err) => { console.error(err); throw err; },
  //     complete: () => {
  //       console.log('Done mining.');
  //     }
  //   })
}

// Start the server when executed directly
declare const require: any;
if (require.main === module) {
  console.log("Running as script.");
  init({
    name: Config.NAME,
  }).catch(console.error);
}
