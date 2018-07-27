export declare module Attributes {
    const FieldOfStudy: string;
    const Paper = "Id,Ti,AA.AuId,AA.AuN,AA.DAuN,F.FId,F.FN,E";
}
export declare type Types = 'Paper' | 'Author' | 'Journal' | 'ConferenceSeries' | 'ConferenceInstance' | 'Affiliation' | 'FieldOfStudy';
export declare enum TypesMap {
    Paper = 0,
    Author = 1,
    Journal = 2,
    ConferenceSeries = 3,
    ConferenceInstance = 4,
    Affiliation = 5,
    FieldOfStudy = 6
}
export * from './field_of_study';
export * from './paper';
