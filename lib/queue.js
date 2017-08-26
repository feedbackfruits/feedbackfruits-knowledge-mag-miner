"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PQueue = require('p-queue');
const queue = new PQueue({
    concurrency: 16
});
exports.default = queue;
