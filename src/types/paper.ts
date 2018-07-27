import { Quad, Context } from 'feedbackfruits-knowledge-engine';

// import * as Context from '../context';

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
  } = metadata;

  let subject = `http://academic.microsoft.com/#/detail/${id}`;
  let quads = [
    { subject, predicate: Context.iris.schema.name, object: displayName },
    description && { subject, predicate: Context.iris.schema.description, object: description },

    { subject, predicate: Context.iris.rdf.type, object: Context.iris.$.Resource },
    // { subject, predicate: Context.iris.rdf.type, object: Context.iris.schema.DigitalDocument },
    // { subject, predicate: Context.iris.rdf.type, object: Context.iris.schema.ScholarlyArticle },

    // { subject, predicate: Context.iris.schema.sameAs, object: `http://dbpedia.org/resource/${wikipediaId}` },
  ].filter(x => x);

  // if (authors) {
  //   quads = [].concat(quads, authors.map(author => {
  //     let iri = `http://academic.microsoft.com/#/detail/${author.AuId}`;
  //     return [
  //       { subject, predicate: Context.iris.schema.author, object: iri },
  //
  //       { subject: iri, predicate: Context.iris.rdf.type, object: Context.iris.schema.Person },
  //       { subject: iri, predicate: Context.iris.schema.name, object: author.DAuN },
  //
  //     ];
  //   }).reduce((memo, x) => memo.concat(x), []));
  // }

  if (entities && entities.length) {
    quads = [].concat(quads, entities.map(about => {
      let iri = `http://dbpedia.org/resource/${fieldNameToWikiId(about.FN)}`;
      // let iri = `http://academic.microsoft.com/#/detail/${about.FId}`;
      return { subject, predicate: Context.iris.schema.about, object: iri };
    }));
  }

  return quads;
}
