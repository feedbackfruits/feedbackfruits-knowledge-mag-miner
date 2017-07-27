"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const miner_1 = require("./miner");
const config_1 = require("./config");
if (require.main === module) {
    console.log("Running as script.");
    global["Miner"] = start();
}
function start() {
    console.log('Starting MAG miner');
    const source = miner_1.mine('FieldOfStudy').map(quad => ({ action: { type: 'write', quad } }));
    return feedbackfruits_knowledge_engine_1.Miner({ name: config_1.NAME, readable: { source } });
}
exports.default = start;
