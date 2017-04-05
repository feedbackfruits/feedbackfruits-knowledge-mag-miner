require('dotenv').load({ silent: true });

const memux = require('memux');
const fetch = require('node-fetch');
const PQueue = require('p-queue');

const {
  NAME = 'microsoft-academic-graph',
  KAFKA_ADDRESS = 'tcp://kafka:9092',
  OUTPUT_TOPIC = 'quad_update_requests',
  MAG_API_KEY,
  START_PAGE = 1,
  END_PAGE = Infinity,
  PAGE_SIZE = 100
} = process.env;

const { send } = memux({
  name: NAME,
  url: KAFKA_ADDRESS,
  output: OUTPUT_TOPIC
});

const queue = new PQueue({
  concurrency: 16
});

const ATTRIBUTES = 'Id,FN,DFN,FC.FId,FP.FId';
const TYPES = {
  Paper: 0,
  Author:	1,
  Journal:	2,
  ConferenceSeries:	3,
  ConferenceInstance:	4,
  Affiliation:	5,
  FieldOfStudy: 6,
};

const MAG_EVALUATE_URL = `https://westus.api.cognitive.microsoft.com/academic/v1.0/evaluate?attributes=${ATTRIBUTES}&subscription-key=${MAG_API_KEY}&orderby=FN:asc`;

var context = {
  'type': '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>',
  'name': '<http://schema.org/name>',
  'image': '<http://schema.org/image>',
  'description': '<http://schema.org/description>',
  'text': '<http://schema.org/text>',
  'url': '<http://schema.org/url>',
  'sameAs': '<http://schema.org/sameAs>',
  'author': '<http://schema.org/author>',
  'citation': '<http://schema.org/citation>',
  'CreativeWork': '<http://schema.org/CreativeWork>',
  'Person': '<http://schema.org/Person>',
  'ReadAction': '<http://schema.org/ReadAction>',
  'WriteAction': '<http://schema.org/WriteAction>',
  'FieldOfStudy': '<http://academic.microsoft.com/FieldOfStudy>',
  'parentFieldOfStudy': '<http://academic.microsoft.com/parentFieldOfStudy>',
  'childFieldOfStudy': '<http://academic.microsoft.com/childFieldOfStudy>'
};

let count = 0;
function sendQuad(quad) {
  console.log(`Sending quad nr ${++count}`);
  return send({ type: 'write', quad });
}

function fieldNameToWikiId(name) {
  return `${name[0].toUpperCase()}${name.toLowerCase().slice(1)}`.replace(/ /g, '_');
}

function fieldOfStudyToQuad(entity) {
  let {
    Id: id,
    DFN: displayName,
    FN: normalizedName,
    FP: parents,
    FC: children,
  } = entity;

  let subject = `<http://academic.microsoft.com/#/detail/${id}>`;
  let wikipediaId = fieldNameToWikiId(displayName);
  let quads = [
    { subject, predicate: context['name'], object: displayName },
    { subject, predicate: context['type'], object: context['FieldOfStudy'] },
    { subject, predicate: context['sameAs'], object: `<http://dbpedia.org/resource/${wikipediaId}>` },
  ];

  if (parents != null) {
    let parentIds = parents.map(x => x.FId)
    quads = [].concat(quads, parentIds.map(parentId => {
      const predicate = context['parentFieldOfStudy'];
      const object = `<http://academic.microsoft.com/#/detail/${parentId}>`;
      return { subject, predicate, object };
    }));
  }

  if (children != null) {
    let childIds = children.map(x => x.FId);
    quads = [].concat(quads, childIds.map(childId => {
      const predicate = context['childFieldOfStudy'];
      const object = `<http://academic.microsoft.com/#/detail/${childId}>`;
      return { subject, predicate, object };
    }));
  }

  return quads;
}

function getPage(page = 1, pageSize = 10) {
  let expr = `Ty='${TYPES.FieldOfStudy}'`;
  let offset = `offset=${(page - 1) * pageSize}`;
  let count = `count=${pageSize}`;
  let url = `${MAG_EVALUATE_URL}&expr=${expr}&${offset}&${count}`;
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

getPages(PAGE_SIZE, START_PAGE, END_PAGE).then(() => {
  console.log(`Done!`);
})
