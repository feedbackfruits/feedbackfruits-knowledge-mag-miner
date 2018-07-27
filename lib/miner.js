"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAG = require("./mag");
const _Doc = require("./doc");
const Config = require("./config");
function mine(type, startPage = Config.START_PAGE, endPage = Config.END_PAGE, pageSize = Config.PAGE_SIZE) {
    if (pageSize <= 0)
        throw new Error(`Page size ${pageSize} must be greater than 0.`);
    if (startPage > endPage)
        throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
    if (startPage === endPage)
        throw new Error(`startPage and endPage are equal. Nothing to do.`);
    return MAG.observableForPagesAndType(startPage, endPage, pageSize, type)
        .map(fieldOfStudy => _Doc.fromFieldOfStudy(fieldOfStudy));
}
exports.mine = mine;
