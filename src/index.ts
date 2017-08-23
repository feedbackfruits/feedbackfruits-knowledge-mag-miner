import { Observable, Subscription } from '@reactivex/rxjs';

import { Operation } from 'memux';
import { Miner, Config as _Config, Helpers } from 'feedbackfruits-knowledge-engine';

import { mine } from './miner';

import * as Config from './config';


export type MinerConfig = {
  name: string
}

export default async function init({ name }: MinerConfig): Promise<Subscription> {
  console.log('Starting MAG miner');
  const send = await Miner({ name, customConfig: Config as any as typeof _Config.Base });
  return mine('FieldOfStudy')
    .map(doc => ({ action: 'write', key: doc['@id'], data: doc }))
    .subscribe({
      next: send,
      error: (err) => { console.error(err); throw err; },
      complete: () => {
        console.log('Done mining.');
      }
    })
}

// Start the server when executed directly
declare const require: any;
if (require.main === module) {
  console.log("Running as script.");
  init({
    name: Config.NAME,
  }).catch(console.error);
}
