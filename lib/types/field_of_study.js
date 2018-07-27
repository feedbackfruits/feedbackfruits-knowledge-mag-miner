"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function fieldNameToWikiId(name) {
    return `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
}
function fieldOfStudyToQuad(entity) {
    let { Id: id, DFN: displayName, FN: normalizedName, FP: parents, FC: children, } = entity;
    let subject = `http://academic.microsoft.com/#/detail/${id}`;
    let wikipediaId = fieldNameToWikiId(displayName);
    let quads = [
        { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.schema.name, object: displayName },
        { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.rdf.type, object: feedbackfruits_knowledge_engine_1.Context.iris.mag.FieldOfStudy },
        { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.owl.sameAs, object: `http://dbpedia.org/resource/${wikipediaId}` },
    ];
    if (parents != null) {
        let parentIds = parents.map(x => x.FId);
        quads = [].concat(quads, parentIds.map(parentId => {
            const predicate = feedbackfruits_knowledge_engine_1.Context.iris.mag.parentFieldOfStudy;
            const object = `http://academic.microsoft.com/#/detail/${parentId}`;
            return { subject, predicate, object };
        }));
    }
    if (children != null) {
        let childIds = children.map(x => x.FId);
        quads = [].concat(quads, childIds.map(childId => {
            const predicate = feedbackfruits_knowledge_engine_1.Context.iris.mag.childFieldOfStudy;
            const object = `http://academic.microsoft.com/#/detail/${childId}`;
            return { subject, predicate, object };
        }));
    }
    return quads;
}
exports.fieldOfStudyToQuad = fieldOfStudyToQuad;
