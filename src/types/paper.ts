import { Quad } from 'feedbackfruits-knowledge-engine';

import * as Context from '../context';

function fieldNameToWikiId(name) {
  return `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
}

export function paperToQuad(entity): Quad[] {
  let {
    Id: id,
    Ti: title,
    E: metadataStr,
    AA: authors,
    'F': entities
  } = entity;

  console.log('Parsing metadata.');
  let metadata = JSON.parse(metadataStr);

  let {
    DN: displayName,
    D: description,
    DOI
  } = metadata;

  let subject = `<http://academic.microsoft.com/#/detail/${id}>`;
  let quads = [
    { subject, predicate: Context.name, object: displayName },
    description && { subject, predicate: Context.description, object: description },

    { subject, predicate: Context.sameAs, object: `<https://dx.doi.org/${DOI}>`},

    { subject, predicate: Context.type, object: Context.Knowledge.Resource },
    { subject, predicate: Context.type, object: Context.DigitalDocument },
    { subject, predicate: Context.type, object: Context.ScholarlyArticle },

    // { subject, predicate: Context.sameAs, object: `<http://dbpedia.org/resource/${wikipediaId}>` },
  ].filter(x => x);

  if (authors) {
    quads = [].concat(quads, authors.map(author => {
      let iri = `<http://academic.microsoft.com/#/detail/${author.AuId}>`;
      return [
        { subject, predicate: Context.author, object: iri },

        { subject: iri, predicate: Context.type, object: Context.Person },
        { subject: iri, predicate: Context.name, object: author.DAuN },

      ];
    }).reduce((memo, x) => memo.concat(x), []));
  }

  if (entities && entities.length) {
    quads = [].concat(quads, entities.map(about => {
      let iri = `<http://dbpedia.org/resource/${fieldNameToWikiId(about.FN)}>`;
      // let iri = `<http://academic.microsoft.com/#/detail/${about.FId}>`;
      return { subject, predicate: Context.about, object: iri };
    }));
  }

  return quads;
}
