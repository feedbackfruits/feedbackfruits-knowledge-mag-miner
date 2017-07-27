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
const rxjs_1 = require("@reactivex/rxjs");
const node_fetch_1 = require("node-fetch");
const config_1 = require("./config");
const Context = require("./context");
const field_of_study_1 = require("./types/field_of_study");
const paper_1 = require("./types/paper");
let ORDER_BY = {
    FieldOfStudy: 'FN:asc',
    Paper: 'Ti:asc'
};
function urlForType(type) {
    let expr = encodeURIComponent(`Ty='${Context.TypesMap[type]}'`);
    let attributes = Context.Attributes[type];
    let orderBy = ORDER_BY[type];
    console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
    return `${config_1.MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${config_1.MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
}
function urlForPage(baseUrl, page, pageSize) {
    let offset = `offset=${(page - 1) * pageSize}`;
    let count = `count=${pageSize}`;
    return `${baseUrl}&${offset}&${count}`;
}
function getPage(url, page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(urlForPage(url, page, pageSize));
        return (yield response.json());
    });
}
function pageToQuads(type, page) {
    if (type === 'Paper') {
        return page.entities.map(paper_1.paperToQuad).reduce((memo, x) => memo.concat(x), []);
    }
    if (type === 'FieldOfStudy') {
        return page.entities.map(field_of_study_1.fieldOfStudyToQuad).reduce((memo, x) => memo.concat(x), []);
    }
}
function mine(type, startPage = parseInt(config_1.START_PAGE), endPage = parseInt(config_1.END_PAGE), pageSize = parseInt(config_1.PAGE_SIZE)) {
    return new rxjs_1.Observable(observer => {
        (() => __awaiter(this, void 0, void 0, function* () {
            const url = urlForType(type);
            console.log('Mining from:', url);
            if (pageSize <= 0)
                throw new Error(`Page size ${pageSize} must be greater than 0.`);
            if (startPage > endPage)
                throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
            if (startPage === endPage)
                throw new Error(`startPage and endPage are equal. Nothing to do.`);
            let page = startPage;
            let done = false;
            while (!done) {
                const result = yield getPage(url, page, pageSize);
                console.log('Page gotten.');
                const quads = pageToQuads(type, result);
                yield Promise.all(quads.map(quad => observer.next(quad)));
                page++;
                done = page === endPage || result.entities.length < pageSize;
                console.log(`Moving on to next page: ${page}? ${!done}`);
            }
            console.log('Done mining!');
            observer.complete();
        }))().catch((err) => observer.error(err));
    });
}
exports.mine = mine;
