import { Observable, Subscription } from '@reactivex/rxjs';

import { Operation } from 'memux';
import { Doc, Miner, Config as _Config, Helpers } from 'feedbackfruits-knowledge-engine';

import { mine } from './miner';

import * as Config from './config';

export type MinerConfig = {
  name: string,
  types?: Array<'FieldOfStudy' | 'Paper'>
}

export default async function init({ name, types = Config.TYPES_TO_MINE }: MinerConfig): Promise<Subscription> {
  console.log('Starting MAG miner');
  const send = await Miner({ name, customConfig: Config as any as typeof _Config.Base });
  // return mine('FieldOfStudy')
  return Observable.merge(...types.map(type => mine(type)))
    .map(doc => ({ action: 'write' as 'write', key: doc['@id'], data: doc }))
    .subscribe({
      next: value => send(value),
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
