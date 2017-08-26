"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("feedbackfruits-knowledge-context"));
var Attributes;
(function (Attributes) {
    Attributes.FieldOfStudy = 'Id,FN,DFN,FC.FId,FP.FId';
    Attributes.Paper = 'Id,Ti,AA.AuId,AA.AuN,AA.DAuN,F.FId,F.FN,E';
})(Attributes = exports.Attributes || (exports.Attributes = {}));
var TypesMap;
(function (TypesMap) {
    TypesMap[TypesMap["Paper"] = 0] = "Paper";
    TypesMap[TypesMap["Author"] = 1] = "Author";
    TypesMap[TypesMap["Journal"] = 2] = "Journal";
    TypesMap[TypesMap["ConferenceSeries"] = 3] = "ConferenceSeries";
    TypesMap[TypesMap["ConferenceInstance"] = 4] = "ConferenceInstance";
    TypesMap[TypesMap["Affiliation"] = 5] = "Affiliation";
    TypesMap[TypesMap["FieldOfStudy"] = 6] = "FieldOfStudy";
})(TypesMap = exports.TypesMap || (exports.TypesMap = {}));
;
