import { Doc, Context } from 'feedbackfruits-knowledge-engine';
// import { FieldOfStudy } from './types';


function dbpediaize(name) {
  const id = `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
  return `http://dbpedia.org/resource/${id}`;
}

export function fromFieldOfStudy(fieldOfStudy): Doc {
  const {
    Id: id,
    DFN: displayName,
    FL: fieldLevel,
    FP: parents = [],
    FC: children = [],
    RF: related = [],
  } = fieldOfStudy;

  const fieldOfStudyURL = `http://academic.microsoft.com/#/detail/${id}`;
  const dbpediaURL = dbpediaize(displayName);

  const parentDocs = parents.map(x => {
    const parentId = x.FId;
    return {
      "@id": `http://academic.microsoft.com/#/detail/${parentId}`,
      // "@type": Context.iris.mag.FieldOfStudy,
    };
  });

  const childDocs = children.map(x => {
    const childId = x.FId;
    return {
      "@id": `http://academic.microsoft.com/#/detail/${childId}`,
      // "@type": Context.iris.mag.FieldOfStudy,
    };
  });

  const relatedDocs = related.map(x => {
    const relatedId = x.FId;
    return {
      "@id": `http://academic.microsoft.com/#/detail/${relatedId}`,
      // "@type": Context.iris.mag.FieldOfStudy,
      [Context.iris.mag.relatesToFieldOfStudy]: fieldOfStudyURL,
    };
  });

  return {
    "@id": fieldOfStudyURL,
    "@type": [
      Context.iris.mag.FieldOfStudy
    ],
    "name": displayName,
    [Context.iris.mag.fieldLevel]: fieldLevel,
    [Context.iris.$.sameAsEntity]: {
      "@id": dbpediaURL,
      "@type": [
        Context.iris.$.Entity
      ],
      "name": displayName,
      [Context.iris.$.sameAsFieldOfStudy]: fieldOfStudyURL
    },
    [Context.iris.mag.parentFieldOfStudy]: parentDocs,
    [Context.iris.mag.childFieldOfStudy]: childDocs,
    [Context.iris.mag.relatedFieldOfStudy]: relatedDocs
  };

}
