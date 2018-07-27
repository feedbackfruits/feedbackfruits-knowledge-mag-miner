"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function dbpediaize(name) {
    const id = `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
    return `http://dbpedia.org/resource/${id}`;
}
function fromFieldOfStudy(fieldOfStudy) {
    const { Id: id, DFN: displayName, FL: fieldLevel, FP: parents = [], FC: children = [], RF: related = [], } = fieldOfStudy;
    const fieldOfStudyURL = `http://academic.microsoft.com/#/detail/${id}`;
    const dbpediaURL = dbpediaize(displayName);
    const parentDocs = parents.map(x => {
        const parentId = x.FId;
        return {
            "@id": `http://academic.microsoft.com/#/detail/${parentId}`,
        };
    });
    const childDocs = children.map(x => {
        const childId = x.FId;
        return {
            "@id": `http://academic.microsoft.com/#/detail/${childId}`,
        };
    });
    const relatedDocs = related.map(x => {
        const relatedId = x.FId;
        return {
            "@id": `http://academic.microsoft.com/#/detail/${relatedId}`,
            [feedbackfruits_knowledge_engine_1.Context.iris.mag.relatesToFieldOfStudy]: fieldOfStudyURL,
        };
    });
    return {
        "@id": fieldOfStudyURL,
        "@type": [
            feedbackfruits_knowledge_engine_1.Context.iris.mag.FieldOfStudy
        ],
        "name": displayName,
        [feedbackfruits_knowledge_engine_1.Context.iris.mag.fieldLevel]: fieldLevel,
        [feedbackfruits_knowledge_engine_1.Context.iris.$.sameAsEntity]: {
            "@id": dbpediaURL,
            "@type": [
                feedbackfruits_knowledge_engine_1.Context.iris.$.Entity
            ],
            "name": displayName,
            [feedbackfruits_knowledge_engine_1.Context.iris.$.sameAsFieldOfStudy]: fieldOfStudyURL
        },
        [feedbackfruits_knowledge_engine_1.Context.iris.mag.parentFieldOfStudy]: parentDocs,
        [feedbackfruits_knowledge_engine_1.Context.iris.mag.childFieldOfStudy]: childDocs,
        [feedbackfruits_knowledge_engine_1.Context.iris.mag.relatedFieldOfStudy]: relatedDocs
    };
}
exports.fromFieldOfStudy = fromFieldOfStudy;
