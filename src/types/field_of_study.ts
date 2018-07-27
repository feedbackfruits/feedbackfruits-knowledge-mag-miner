import { Quad, Context } from 'feedbackfruits-knowledge-engine';

function fieldNameToWikiId(name) {
  return `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
}

export function fieldOfStudyToQuad(entity): Quad[] {
  let {
    Id: id,
    DFN: displayName,
    FN: normalizedName,
    FP: parents,
    FC: children,
  } = entity;

  let subject = `http://academic.microsoft.com/#/detail/${id}`;
  let wikipediaId = fieldNameToWikiId(displayName);
  let quads = [
    { subject, predicate: Context.iris.schema.name, object: displayName },
    { subject, predicate: Context.iris.rdf.type, object: Context.iris.mag.FieldOfStudy },
    { subject, predicate: Context.iris.owl.sameAs, object: `http://dbpedia.org/resource/${wikipediaId}` },
  ];

  if (parents != null) {
    let parentIds = parents.map(x => x.FId)
    quads = [].concat(quads, parentIds.map(parentId => {
      const predicate = Context.iris.mag.parentFieldOfStudy;
      const object = `http://academic.microsoft.com/#/detail/${parentId}`;
      return { subject, predicate, object };
    }));
  }

  if (children != null) {
    let childIds = children.map(x => x.FId);
    quads = [].concat(quads, childIds.map(childId => {
      const predicate = Context.iris.mag.childFieldOfStudy;
      const object = `http://academic.microsoft.com/#/detail/${childId}`;
      return { subject, predicate, object };
    }));
  }

  return quads;
}
