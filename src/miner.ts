import { Observable } from '@reactivex/rxjs';
// import fetch from 'node-fetch';

import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
import * as MAG from './mag';
import * as _Doc from './doc';
import * as Config from './config';

// import {
//   MAG_EVALUATE_URL,
//   MAG_API_KEY,
//
//   PAGE_SIZE,
//   START_PAGE,
//   END_PAGE,
// } from './config';
//
// import queue from './queue';
//
// import { fieldOfStudyToQuad } from './types/field_of_study';
// import { paperToQuad } from './types/paper';
//
// let ORDER_BY = {
//   FieldOfStudy: 'FN:asc',
//   Paper: 'Ti:asc'
// }
//
// function urlForType(type: Types.Types) {
//   let expr = encodeURIComponent(`Ty='${Types.TypesMap[type]}'`);
//   let attributes = Types.Attributes[type];
//   let orderBy = ORDER_BY[type];
//   console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
//   return `${MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
// }
//
// function urlForPage(baseUrl: string, page: number, pageSize: number): string {
//   const offset = `offset=${(page - 1) * pageSize}`;
//   const count = `count=${pageSize}`;
//   const url = `${baseUrl}&${offset}&${count}`;
//   console.log('Mining from:', url);
//   return url;
// }
//
// export type Page<T> = {
//   pageInfo: {
//     page: number,
//     pageSize: number,
//     done: boolean
//   }
//   entities: T[]
// };
// async function getPage<T>(url: string, page: number, pageSize: number): Promise<Page<T>> {
//   const response = await fetch(urlForPage(url, page, pageSize))
//   const { entities } = (await response.json()) as Page<T>;
//
//   const done = entities.length < pageSize;
//   const pageInfo = {
//     page,
//     pageSize,
//     done
//   }
//
//   return {
//     pageInfo,
//     entities
//   }
//
// }
// //
// // function pageToQuads<T>(type: Types.Types, page: Page<T>): Quad[] {
// //   if (type === 'Paper') {
// //     return page.entities.map(paperToQuad).reduce((memo, x) => memo.concat(x), []);
// //   }
// //
// //   if (type === 'FieldOfStudy') {
// //     return page.entities.map(fieldOfStudyToQuad).reduce((memo, x) => memo.concat(x), []);
// //   }
// // }
//
// export function observableForPagesAndType(page: number, pageSize: number, type: Types.Types): Observable<Doc> {
//   return Observable.defer(async () => {
//     const url = urlForType(type);
//     const { pageInfo, entities } = await getPage(url, page, pageSize);
//     if (pageInfo.done) return Observable.from(entities);
//     return Observable.concat(Observable.from(entities), Observable.defer(() => {
//       return observableForPagesAndType(pageInfo.page + 1, pageInfo.pageSize, type);
//     }))
//   });
// }

export function mine(type: Types.Types, startPage = Config.START_PAGE, endPage = Config.END_PAGE, pageSize = Config.PAGE_SIZE): Observable<Doc> {
  if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
  if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
  if (startPage === endPage) throw new Error(`startPage and endPage are equal. Nothing to do.`);

  return MAG.observableForPagesAndType(startPage, endPage, pageSize, type)
    .map(fieldOfStudy => _Doc.fromFieldOfStudy(fieldOfStudy));

  // return Observable.defer(async () => {
  //   const done = page === endPage || result.entities.length < pageSize;
  //   return Observable.concat()
  // });
  //
  // return new Observable<Doc>(observer => {
  //   (async () => {
  //
  //     // if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
  //     // if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
  //     // if (startPage === endPage) throw new Error(`startPage and endPage are equal. Nothing to do.`);
  //
  //     const url = urlForType(type);
  //     let page = startPage;
  //     let done = false;
  //     while (!done) {
  //       // const result = await getPage(url, page, pageSize);
  //       console.log('Page gotten.')
  //       // const quads = pageToQuads(type, result);
  //       // const doc = await Doc.fromQuads(quads, Context.context);
  //       // const docs = await Doc.flatten(doc, Context.context);
  //       // await Promise.all(docs.map(doc => observer.next(doc)));
  //
  //       page++;
  //       done = page === endPage || result.entities.length < pageSize;
  //       console.log(`Moving on to next page: ${page}? ${!done}`);
  //     }
  //
  //     console.log('Done mining!');
  //     observer.complete();
  //   })().catch((err) => observer.error(err));
  // });
}
