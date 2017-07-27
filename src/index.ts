import { Observable } from '@reactivex/rxjs';

import { Actionable, Readable } from 'memux';
import { Miner } from 'feedbackfruits-knowledge-engine';

import { mine } from './miner';

import {
  NAME,
} from './config';


// Start the server when executed directly
declare const require: any;
if (require.main === module) {
  console.log("Running as script.");

  // Export globally
  // tslint:disable-next-line no-string-literal
  global["Miner"] = start();
}

export default function start() {
  console.log('Starting MAG miner');
  const source = mine('FieldOfStudy').map(quad => ({ action: { type: 'write', quad } } as Actionable));
  return Miner({ name: NAME, readable: { source } });
}

// export default miner;
