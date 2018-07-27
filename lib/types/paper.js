"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function fieldNameToWikiId(name) {
    return `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
}
function paperToQuad(entity) {
    let { Id: id, Ti: title, E: metadataStr, AA: authors, 'F': entities } = entity;
    console.log('Parsing metadata.');
    let metadata = JSON.parse(metadataStr);
    let { DN: displayName, D: description, } = metadata;
    let subject = `http://academic.microsoft.com/#/detail/${id}`;
    let quads = [
        { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.schema.name, object: displayName },
        description && { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.schema.description, object: description },
        { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.rdf.type, object: feedbackfruits_knowledge_engine_1.Context.iris.$.Resource },
    ].filter(x => x);
    if (entities && entities.length) {
        quads = [].concat(quads, entities.map(about => {
            let iri = `http://dbpedia.org/resource/${fieldNameToWikiId(about.FN)}`;
            return { subject, predicate: feedbackfruits_knowledge_engine_1.Context.iris.schema.about, object: iri };
        }));
    }
    return quads;
}
exports.paperToQuad = paperToQuad;
