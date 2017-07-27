"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
const config_1 = require("./config");
const Context = require("./context");
const queue_1 = require("./queue");
const paper_1 = require("./types/paper");
let ORDER_BY = {
    FieldOfStudy: 'FN:asc',
    Paper: 'Ti:asc'
};
function mine(types) {
    return Promise.all(types.map(type => {
        let expr = encodeURIComponent(`Ty='${Context.Types[type]}'`);
        let attributes = Context.Attributes[type];
        let orderBy = ORDER_BY[type];
        console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
        let url = `${config_1.MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${config_1.MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
        return getPages(url, parseInt(config_1.PAGE_SIZE), parseInt(config_1.START_PAGE), parseInt(config_1.END_PAGE));
    }));
}
exports.mine = mine;
function getPages(url, pageSize = 10, startPage = 1, endPage = Infinity) {
    if (pageSize <= 0)
        throw new Error(`Page size ${pageSize} must be greater than 0.`);
    if (startPage > endPage)
        throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
    if (startPage === endPage)
        return Promise.resolve();
    console.log(`Getting page: ${startPage} with size ${pageSize}. Ending at page ${endPage}`);
    return queue_1.default.add(() => getPage(url, startPage, pageSize).then(page => {
        console.log(`Page length: `, page.entities.length);
        let quads = page.entities.map(paper_1.paperToQuad).reduce((memo, x) => memo.concat(x), []);
    })).then(page => {
        if (!page)
            return Promise.resolve();
        if (page.entities.length < pageSize) {
            console.log(`Reached page with smaller size (${page.entities.length}) than expected (${pageSize}). Assuming end of list and quitting.`);
            return Promise.resolve();
        }
        console.log(`Continuing getPages to page ${startPage + 1}, ending at page ${endPage}`);
        return getPages(url, pageSize, startPage + 1, endPage);
    });
}
function getPage(url, page = 1, pageSize = 10) {
    let offset = `offset=${(page - 1) * pageSize}`;
    let count = `count=${pageSize}`;
    console.log(`Getting page with:`, url, offset, count);
    return fetch(`${url}&${offset}&${count}`).then(res => res.json());
}
