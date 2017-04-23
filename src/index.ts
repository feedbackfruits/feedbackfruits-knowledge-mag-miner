const memux = require('memux');
const fetch = require('node-fetch');
const PQueue = require('p-queue');

import {
  NAME,
  KAFKA_ADDRESS,
  OUTPUT_TOPIC,
  MAG_EVALUATE_URL,
  MAG_API_KEY,

  PAGE_SIZE,
  START_PAGE,
  END_PAGE,
} from './config';

import Context from './context';
// import { getPages } from './miner';
import { fieldOfStudyToQuad } from './field_of_study';
import { paperToQuad } from './paper';

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

function getPage(url, page = 1, pageSize = 10) {
  let offset = `offset=${(page - 1) * pageSize}`;
  let count = `count=${pageSize}`;
  console.log(`Getting page with:`, url, offset, count);
  return fetch(`${url}&${offset}&${count}`).then(res => res.json());
}

function getPages(url, pageSize = 10, startPage = 1, endPage = Infinity) {
  if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
  if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
  if (startPage === endPage) return Promise.resolve();

  console.log(`Getting page: ${startPage} with size ${pageSize}. Ending at page ${endPage}`);

  return queue.add(() => getPage(url, startPage, pageSize).then(page => {
    console.log(`Page length: `, page.entities.length);
    let quads = page.entities.map(paperToQuad).reduce((memo, x) => memo.concat(x), []);
    return Promise.all(quads.map(sendQuad)).then(() => page);
  })).then(page => {
    if (!page) return Promise.resolve();
    if (page.entities.length < pageSize) {
      console.log(`Reached page with smaller size (${page.entities.length}) than expected (${pageSize}). Assuming end of list and quitting.`);
      return Promise.resolve();
    }

    console.log(`Continuing getPages to page ${startPage + 1}, ending at page ${endPage}`);
    return getPages(url, pageSize, startPage + 1, endPage);
  });
}

let ORDER_BY = {
  FieldOfStudy: 'FN:asc',
  Paper: 'Ti:asc'
}

function mine(types) {
  return Promise.all(types.map(type => {
    let expr = encodeURIComponent(`Ty='${Context.Types[type]}'`);
    let attributes = Context.Attributes[type];
    let orderBy = ORDER_BY[type];
    console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
    let url = `${MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
    return getPages(url, parseInt(<any>PAGE_SIZE), parseInt(<any>START_PAGE), parseInt(<any>END_PAGE))
  }));
}

console.log('Starting MAG miner...');

const types = [ 'Paper' ];

mine(types).then(() => {
  console.log(`Done!`);
  return;
}).catch(err => console.error(err));
