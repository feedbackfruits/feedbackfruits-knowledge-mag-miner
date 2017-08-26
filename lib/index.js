"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const miner_1 = require("./miner");
const Config = require("./config");
function init({ name }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting MAG miner');
        const send = yield feedbackfruits_knowledge_engine_1.Miner({ name, customConfig: Config });
        return miner_1.mine('FieldOfStudy')
            .map(doc => ({ action: 'write', key: doc['@id'], data: doc }))
            .subscribe({
            next: send,
            error: (err) => { console.error(err); throw err; },
            complete: () => {
                console.log('Done mining.');
            }
        });
    });
}
exports.default = init;
if (require.main === module) {
    console.log("Running as script.");
    init({
        name: Config.NAME,
    }).catch(console.error);
}
