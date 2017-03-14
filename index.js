require('dotenv').load({ silent: true });

const MAG_API_ENDPOINT = 'https://academic.microsoft.com/api/browse/GetEntityDetails';
const DBPEDIA_ENDPOINT = 'http://dbpedia.org/resource/'

const {
  NAME = 'microsoft-academic-graph',
  KAFKA_ADDRESS = 'tcp://kafka:9092',
  CAYLEY_ADDRESS = 'feedbackfruits-cayley.herokuapp.com',
  OUTPUT_TOPIC = 'quad_update_requests',
  START_TOPIC = 138885662
} = process.env;

const memux = require('memux');
const Cayley = require('node-cayley');
const fetch = require('node-fetch');
const PQueue = require('p-queue');
const jsonld = require('jsonld').promises;
const log = console.log.bind(console);

const { send } = memux({
  name: NAME,
  url: KAFKA_ADDRESS,
  output: OUTPUT_TOPIC
});

const queue = new PQueue({
  concurrency: 16
});

const cayley = Cayley(CAYLEY_ADDRESS);


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

function get(id) {
  const url = `${MAG_API_ENDPOINT}?entityId=${id}&correlationId=1`;
  return fetch(url).then(response => response.json());
};


const done = {};

const getEntityIdFromWikipediaPageUrl = url => {
  const res = url.match(/en\.wikipedia\.org\/wiki\/(.*)/);
  return res && res[1];
}

let count = 0;

function doThings(magId) {
  if (magId in done) return;

  return queue.add(() => {
    return new Promise((resolve, reject) => {
      cayley.g.V(`<http://academic.microsoft.com/#/detail/${magId}>`).Has(context['type'], context['FieldOfStudy']).All((error, { result }) => {
        if (error) return reject(error);
        resolve(result);
      });
    }).then(result => {
      debugger;
      if (result) return done[magId] = true;

      console.log(count++, magId, queue.size);
      return get(magId).then(data => {
        const { websites } = data;

        const id = websites.map(website => {
          const { u: url } = website;
          return getEntityIdFromWikipediaPageUrl(url);
        }).find(x => x);

        if (!id) return;

        const subject = `<http://academic.microsoft.com/#/detail/${magId}>`;

        done[magId] = true;

        data.parentFieldsOfStudy && data.parentFieldsOfStudy.map(parent => parent.id).forEach(parentId => {
          const subject = `<http://academic.microsoft.com/#/detail/${magId}>`;
          const predicate = context['parentFieldOfStudy'];
          const object = `<http://academic.microsoft.com/#/detail/${parentId}>`;

          send({ type: 'write', quad: { subject, predicate, object }});
          doThings(parentId);
        });

        data.childFieldsOfStudy && data.childFieldsOfStudy.map(child => child.id).forEach(childId => {
          const subject = `<http://academic.microsoft.com/#/detail/${magId}>`;
          const predicate = context['childFieldOfStudy'];
          const object = `<http://academic.microsoft.com/#/detail/${childId}>`;

          send({ type: 'write', quad: { subject, predicate, object }});
          doThings(childId);
        });

        return Promise.all([
          send({ type: 'write', quad: { subject, predicate: context['name'], object: data.entityTitle } }),
          send({ type: 'write', quad: { subject, predicate: context['type'], object: context['FieldOfStudy'] } }),
          send({ type: 'write', quad: { subject, predicate: context['description'], object: data.description } }),
          data.image ? send({ type: 'write', quad: { subject, predicate: context['image'], object: `<${data.image}>` } }) : Promise.resolve()  ,
          send({ type: 'write', quad: { subject, predicate: context['sameAs'], object: `<http://dbpedia.org/resource/${id}>` } })
        ]);
      });
    });
  });
}

doThings(START_TOPIC);
