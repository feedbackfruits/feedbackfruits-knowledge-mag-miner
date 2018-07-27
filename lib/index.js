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
        const docs = miner_1.mine('FieldOfStudy');
        let count = 0;
        yield new Promise((resolve, reject) => {
            docs.subscribe({
                next: (doc) => {
                    count++;
                    console.log('Sending doc:', doc['@id']);
                    return send({ action: 'write', key: doc['@id'], data: doc });
                },
                error: (reason) => {
                    console.log('Miner crashed...');
                    console.error(reason);
                    reject(reason);
                },
                complete: () => {
                    console.log('Miner completed');
                    resolve();
                }
            });
        });
        console.log(`Mined ${count} docs from MAG`);
        return;
    });
}
exports.default = init;
if (require.main === module) {
    console.log("Running as script.");
    init({
        name: Config.NAME,
    }).catch(console.error);
}
