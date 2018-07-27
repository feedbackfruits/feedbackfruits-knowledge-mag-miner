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
const node_fetch_1 = require("node-fetch");
const rxjs_1 = require("@reactivex/rxjs");
const Types = require("./types");
const Config = require("./config");
const ORDER_BY = {
    FieldOfStudy: 'FN:asc',
    Paper: 'Ti:asc'
};
function urlForType(type) {
    let expr = encodeURIComponent(`Ty='${Types.TypesMap[type]}'`);
    let attributes = Types.Attributes[type];
    let orderBy = ORDER_BY[type];
    console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
    return `${Config.MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${Config.MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
}
exports.urlForType = urlForType;
function urlForPage(baseUrl, page, pageSize) {
    const offset = `offset=${(page - 1) * pageSize}`;
    const count = `count=${pageSize}`;
    const url = `${baseUrl}&${offset}&${count}`;
    console.log('Mining from:', url);
    return url;
}
exports.urlForPage = urlForPage;
function getPage(url, page, endPage, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(urlForPage(url, page, pageSize));
        const { entities } = (yield response.json());
        const done = entities.length < pageSize || page === (endPage - 1);
        console.log(`Got page ${page}, stoppig at ${endPage}, done?: ${done}`);
        const pageInfo = {
            page,
            pageSize,
            done
        };
        return {
            pageInfo,
            entities
        };
    });
}
exports.getPage = getPage;
function observableForPagesAndType(page, endPage, pageSize, type) {
    console.log(`Getting Observable for pages ${page} to ${endPage} of type ${type}`);
    return rxjs_1.Observable.defer(() => __awaiter(this, void 0, void 0, function* () {
        const url = urlForType(type);
        return getPage(url, page, endPage, pageSize);
    })).concatMap((page) => {
        const { pageInfo, entities } = page;
        if (pageInfo.done)
            return rxjs_1.Observable.from(entities);
        return rxjs_1.Observable.concat(rxjs_1.Observable.from(entities), observableForPagesAndType(pageInfo.page + 1, endPage, pageInfo.pageSize, type));
    });
}
exports.observableForPagesAndType = observableForPagesAndType;
