export * from 'feedbackfruits-knowledge-context';

export module Attributes {
  export const FieldOfStudy = 'Id,FN,DFN,FC.FId,FP.FId';
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


// export default Context;
