"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("@reactivex/rxjs");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const config_1 = require("./config");
const source = new rxjs_1.Observable(observer => {
});
const miner = feedbackfruits_knowledge_engine_1.Miner({ name: config_1.NAME, readable: { source } });
exports.default = miner;
