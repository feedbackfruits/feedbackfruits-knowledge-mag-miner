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
var Types;
(function (Types) {
    Types[Types["Paper"] = 0] = "Paper";
    Types[Types["Author"] = 1] = "Author";
    Types[Types["Journal"] = 2] = "Journal";
    Types[Types["ConferenceSeries"] = 3] = "ConferenceSeries";
    Types[Types["ConferenceInstance"] = 4] = "ConferenceInstance";
    Types[Types["Affiliation"] = 5] = "Affiliation";
    Types[Types["FieldOfStudy"] = 6] = "FieldOfStudy";
})(Types = exports.Types || (exports.Types = {}));
;
