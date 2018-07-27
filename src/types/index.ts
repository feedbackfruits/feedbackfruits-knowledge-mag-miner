export module Attributes {
  export const FieldOfStudy = [
    'Id',
    'FN',
    'DFN',
    'FC.FId', // Children
    'FP.FId', // Parents
    'FL',
    'RF', // Related fieldOfStudy (not documented)
  ].join(',');
  export const Paper = 'Id,Ti,AA.AuId,AA.AuN,AA.DAuN,F.FId,F.FN,E';
}

export type Types = 'Paper' | 'Author' | 'Journal' | 'ConferenceSeries' | 'ConferenceInstance' | 'Affiliation' | 'FieldOfStudy';
export enum TypesMap {
  Paper,
  Author,
  Journal,
  ConferenceSeries,
  ConferenceInstance,
  Affiliation,
  FieldOfStudy,
};

export * from './field_of_study';
export * from './paper';
