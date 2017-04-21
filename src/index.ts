const memux = require('memux');
const fetch = require('node-fetch');
const PQueue = require('p-queue');

import {
  NAME,
  KAFKA_ADDRESS,
  OUTPUT_TOPIC,
  MAG_EVALUATE_URL,
  MAG_API_KEY,
} from './config';

import Context from './context';
import { fieldOfStudyToQuad } from './field_of_study';

const { send } = memux({
  name: NAME,
  url: KAFKA_ADDRESS,
  output: OUTPUT_TOPIC
});

const queue = new PQueue({
  concurrency: 16
});

let count = 0;
function sendQuad(quad) {
  console.log(`Sending quad nr ${++count}`);
  return send({ type: 'write', quad });
}

function getPage(page = 1, pageSize = 10) {
  let expr = `Ty='${Context.Types.FieldOfStudy}'`;
  let offset = `offset=${(page - 1) * pageSize}`;
  let count = `count=${pageSize}`;
  let url = `${MAG_EVALUATE_URL}?attributes=${Context.Attributes.FieldOfStudy}&subscription-key=${MAG_API_KEY}&orderby=FN:asc&expr=${expr}&${offset}&${count}`;
  // console.log(`Getting page with:`, url);
  return fetch(url).then(res => res.json());
}

function getPages(pageSize = 10, startPage = 1, endPage = Infinity) {
  if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
  if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
  if (startPage === endPage) return Promise.resolve();

  console.log(`Getting page: ${startPage} with size ${pageSize}. Ending at page ${endPage}`);

  return queue.add(() => getPage(startPage, pageSize).then(page => {
    console.log(`Page length: `, page.entities.length);
    let quads = page.entities.map(fieldOfStudyToQuad).reduce((memo, x) => memo.concat(x), []);
    return Promise.all(quads.map(sendQuad)).then(() => page);
  })).then(page => {
    if (page.entities.length < pageSize) {
      console.log(`Reached page with smaller size (${page.entities.length}) than expected (${pageSize}). Assuming end of list and quitting.`);
      return Promise.resolve();
    }

    console.log(`Continuing getPages to page ${startPage + 1}, ending at page ${endPage}`);
    return getPages(pageSize, startPage + 1, endPage);
  });
}

console.log('Starting MAG miner...');
//
// getPages(PAGE_SIZE, START_PAGE, END_PAGE).then(() => {
//   console.log(`Done!`);
// })
