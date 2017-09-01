import test from 'ava';
import nock from 'nock';
import { Observable } from '@reactivex/rxjs';

import { mine } from '../lib/miner';
import { PAGE_SIZE, START_PAGE } from '../lib/config';

import mockFieldOfStudyPage from './support/mockFieldOfStudyPage';
import mockPaperPage from './support/mockPaperPage';

test('it exists', t => {
  t.not(mine, undefined);
  t.is(typeof mine, 'function');
});

test('it returns an Observable', t => {
  t.is(mine() instanceof Observable, true);
});

test('it requires a valid page config', t => {
  return Promise.all([
    new Promise((resolve, reject) => {
      mine('Paper', 1, 2, -1).subscribe({
        next: (...args) => reject(...args),
        error: (...args) => resolve(...args),
        complete: (...args) => reject(...args),
      });
    }).then((...args) => t.pass(...args), (...args) => t.fail(...args)),

    new Promise((resolve, reject) => {
      mine('Paper', 2, 1, 10).subscribe({
        next: (...args) => reject(...args),
        error: (...args) => resolve(...args),
        complete: (...args) => reject(...args),
      });
    }).then((...args) => t.pass(...args), (...args) => t.fail(...args)),

    new Promise((resolve, reject) => {
      mine('Paper', 1, 1, 10).subscribe({
        next: (...args) => reject(...args),
        error: (...args) => resolve(...args),
        complete: (...args) => reject(...args),
      });
    }).then((...args) => t.pass(...args), (...args) => t.fail(...args))
  ]);
});

test('it mines fields of study', t => {
  nock('https://westus.api.cognitive.microsoft.com')
    .get(`/academic/v1.0/evaluate?attributes=Id,FN,DFN,FC.FId,FP.FId&subscription-key=undefined&orderby=FN:asc&expr=Ty%3D%276%27&offset=${(START_PAGE - 1) * PAGE_SIZE}&count=${PAGE_SIZE}`)
    .reply(200, mockFieldOfStudyPage);

  const observable = mine('FieldOfStudy');

  return new Promise((resolve, reject) => {
    observable.subscribe({
      next: (...args) => resolve(...args),
      error: (...args) => reject(...args),
      complete: (...args) => reject(...args),
    });
  }).then((operation) => {
    return t.deepEqual(operation, {
      '@id': 'http://academic.microsoft.com/#/detail/75678561',
      'http://schema.org/name': [
        '0-10 V lighting control',
      ],
      'http://schema.org/sameAs': [
        '<http://dbpedia.org/resource/0-10_V_lighting_control>',
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        '<http://academic.microsoft.com/FieldOfStudy>',
      ]
    });
  }, (...args) => t.fail(...args));
});

test('it mines papers', t => {
  const observable = mine('Paper');

  nock('https://westus.api.cognitive.microsoft.com')
    .get(`/academic/v1.0/evaluate?attributes=Id,Ti,AA.AuId,AA.AuN,AA.DAuN,F.FId,F.FN,E&subscription-key=undefined&orderby=Ti:asc&expr=Ty%3D%270%27&offset=${(START_PAGE - 1) * PAGE_SIZE}&count=${PAGE_SIZE}`)
    .reply(200, mockPaperPage);

  return new Promise((resolve, reject) => {
    observable.subscribe({
      next: (...args) => resolve(...args),
      error: (...args) => reject(...args),
      complete: (...args) => reject(...args),
    });
  }).then((operation) => {
    return t.deepEqual(operation, {
      '@id': 'http://academic.microsoft.com/#/detail/1994667404',
      'http://schema.org/about': [
        '<http://dbpedia.org/resource/High_electron_mobility_transistor>',
        '<http://dbpedia.org/resource/Chemistry>',
        '<http://dbpedia.org/resource/Physics>',
      ],
      'http://schema.org/author': [
        '<http://academic.microsoft.com/#/detail/1818411831>',
        '<http://academic.microsoft.com/#/detail/2054892899>',
        '<http://academic.microsoft.com/#/detail/2109856768>',
        '<http://academic.microsoft.com/#/detail/1982950984>',
      ],
      'http://schema.org/name': [
        '0.05-Î¼m-Gate InAlAs/InGaAs High Electron Mobility Transistor and Reduction of Its Short-Channel Effects',
      ],
      'http://schema.org/sameAs': [
        '<https://dx.doi.org/10.1143/JJAP.33.798>',
      ],
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [
        '<https://knowledge.express/Resource>',
        '<http://schema.org/DigitalDocument>',
        '<http://schema.org/ScholarlyArticle>',
      ],
    });
  }, (...args) => t.fail(...args));
});
