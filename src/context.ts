export module Context {
  export const type = '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>';
  export const name = '<http://schema.org/name>';
  export const image = '<http://schema.org/image>';
  export const description = '<http://schema.org/description>';
  export const text = '<http://schema.org/text>';
  export const url = '<http://schema.org/url>';
  export const sameAs = '<http://schema.org/sameAs>';
  export const author = '<http://schema.org/author>';
  export const about = '<http://schema.org/about>';
  export const citation = '<http://schema.org/citation>';
  export const CreativeWork = '<http://schema.org/CreativeWork>';
  export const DigitalDocument = '<http://schema.org/DigitalDocument>';
  export const ScholarlyArticle = '<http://schema.org/ScholarlyArticle>';
  export const Person = '<http://schema.org/Person>';
  export const ReadAction = '<http://schema.org/ReadAction>';
  export const WriteAction = '<http://schema.org/WriteAction>';
  export const FieldOfStudy = '<http://academic.microsoft.com/FieldOfStudy>';
  export const parentFieldOfStudy = '<http://academic.microsoft.com/parentFieldOfStudy>';
  export const childFieldOfStudy = '<http://academic.microsoft.com/childFieldOfStudy>';

  export module Knowledge {
    export const Topic = '<https://knowledge.express/Topic>';
    export const next = '<https://knowledge.express/next>';
    export const previous = '<https://knowledge.express/previous>';
    export const child = '<https://knowledge.express/child>';
    export const parent = '<https://knowledge.express/parent>';
    export const resource = '<https://knowledge.express/resource>';

    export const Resource = '<https://knowledge.express/Resource>';
    export const topic = '<https://knowledge.express/topic>';
    export const entity = '<https://knowledge.express/entity>';

    export const Entity = '<https://knowledge.express/Entity>';
  };

  export module Attributes{
    export const FieldOfStudy = 'Id,FN,DFN,FC.FId,FP.FId';
    export const Paper = 'Id,Ti,AA.AuId,AA.AuN,AA.DAuN,F.FId,F.FN,E';
  }

  export enum Types {
    Paper,
    Author,
    Journal,
    ConferenceSeries,
    ConferenceInstance,
    Affiliation,
    FieldOfStudy,
  };
};

export default Context;
