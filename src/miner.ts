import { Observable } from '@reactivex/rxjs';
import fetch from 'node-fetch';

import { Quad, Doc, Helpers } from 'feedbackfruits-knowledge-engine';

import {
  MAG_EVALUATE_URL,
  MAG_API_KEY,

  PAGE_SIZE,
  START_PAGE,
  END_PAGE,
} from './config';

import * as Context from './context';
import queue from './queue';

import { fieldOfStudyToQuad } from './types/field_of_study';
import { paperToQuad } from './types/paper';

let ORDER_BY = {
  FieldOfStudy: 'FN:asc',
  Paper: 'Ti:asc'
}

function urlForType(type: Context.Types) {
  let expr = encodeURIComponent(`Ty='${Context.TypesMap[type]}'`);
  let attributes = Context.Attributes[type];
  let orderBy = ORDER_BY[type];
  console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
  return `${MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
}

function urlForPage(baseUrl: string, page: number, pageSize: number): string {
  const offset = `offset=${(page - 1) * pageSize}`;
  const count = `count=${pageSize}`;
  const url = `${baseUrl}&${offset}&${count}`;
  console.log('Mining from:', url);
  return url;
}

export type Page<T> = {
  entities: T[]
};
async function getPage<T>(url: string, page: number, pageSize: number): Promise<Page<T>> {
  const response = await fetch(urlForPage(url, page, pageSize))
  return (await response.json()) as Page<T>;
}

function pageToQuads<T>(type: Context.Types, page: Page<T>): Quad[] {
  if (type === 'Paper') {
    return page.entities.map(paperToQuad).reduce((memo, x) => memo.concat(x), []);
  }

  if (type === 'FieldOfStudy') {
    return page.entities.map(fieldOfStudyToQuad).reduce((memo, x) => memo.concat(x), []);
  }
}

export function mine(type: Context.Types, startPage = START_PAGE, endPage = END_PAGE, pageSize = PAGE_SIZE): Observable<Doc> {
  return new Observable<Doc>(observer => {
    (async () => {
      const url = urlForType(type);

      if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
      if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
      if (startPage === endPage) throw new Error(`startPage and endPage are equal. Nothing to do.`);

      let page = startPage;
      let done = false;
      while (!done) {
        const result = await getPage(url, page, pageSize);
        console.log('Page gotten.')
        const quads = pageToQuads(type, result);
        const docs = Helpers.quadsToDocs(quads);
        await Promise.all(docs.map(doc => observer.next(doc)));

        page++;
        done = page === endPage || result.entities.length < pageSize;
        console.log(`Moving on to next page: ${page}? ${!done}`);
      }

      console.log('Done mining!');
      observer.complete();
    })().catch((err) => observer.error(err));
  });
}
