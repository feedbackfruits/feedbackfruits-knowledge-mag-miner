import { Quad } from 'feedbackfruits-knowledge-engine';

import * as Context from '../context';

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

  let subject = `<http://academic.microsoft.com/#/detail/${id}>`;
  let wikipediaId = fieldNameToWikiId(displayName);
  let quads = [
    { subject, predicate: Context.name, object: displayName },
    { subject, predicate: Context.type, object: Context.AcademicGraph.FieldOfStudy },
    { subject, predicate: Context.sameAs, object: `<http://dbpedia.org/resource/${wikipediaId}>` },
  ];

  if (parents != null) {
    let parentIds = parents.map(x => x.FId)
    quads = [].concat(quads, parentIds.map(parentId => {
      const predicate = Context.AcademicGraph.parentFieldOfStudy;
      const object = `<http://academic.microsoft.com/#/detail/${parentId}>`;
      return { subject, predicate, object };
    }));
  }

  if (children != null) {
    let childIds = children.map(x => x.FId);
    quads = [].concat(quads, childIds.map(childId => {
      const predicate = Context.AcademicGraph.childFieldOfStudy;
      const object = `<http://academic.microsoft.com/#/detail/${childId}>`;
      return { subject, predicate, object };
    }));
  }

  return quads;
}
