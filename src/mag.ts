import fetch from 'node-fetch';
import { Observable } from '@reactivex/rxjs';
import * as Types from './types';
import * as Config from './config';

export type Page<T> = {
  pageInfo: {
    page: number,
    pageSize: number,
    done: boolean
  }
  entities: T[]
};

const ORDER_BY = {
  FieldOfStudy: 'FN:asc',
  Paper: 'Ti:asc'
}

export type FieldOfStudy = {
  Id: string
  FN: string
  DFN: string
  FC: {
    FId: string
  }
  FP: {
    FId: string
  }
};

export function urlForType(type: Types.Types) {
  let expr = encodeURIComponent(`Ty='${Types.TypesMap[type]}'`);
  let attributes = Types.Attributes[type];
  let orderBy = ORDER_BY[type];
  console.log(`Mining ${type} using ${expr}, finding ${attributes} ordered by ${orderBy}`);
  return `${Config.MAG_EVALUATE_URL}?attributes=${attributes}&subscription-key=${Config.MAG_API_KEY}&orderby=${orderBy}&expr=${expr}`;
}

export function urlForPage(baseUrl: string, page: number, pageSize: number): string {
  const offset = `offset=${(page - 1) * pageSize}`;
  const count = `count=${pageSize}`;
  const url = `${baseUrl}&${offset}&${count}`;
  console.log('Mining from:', url);
  return url;
}

export async function getPage(url: string, page: number, endPage: number, pageSize: number): Promise<Page<FieldOfStudy>> {
  const response = await fetch(urlForPage(url, page, pageSize))
  const { entities } = (await response.json()) as Page<FieldOfStudy>;

  const done = entities.length < pageSize || page === (endPage - 1);
  console.log(`Got page ${page}, stoppig at ${endPage}, done?: ${done}`)
  const pageInfo = {
    page,
    pageSize,
    done
  }

  return {
    pageInfo,
    entities
  }
}

export function observableForPagesAndType(page: number, endPage: number, pageSize: number, type: Types.Types): Observable<FieldOfStudy> {
  console.log(`Getting Observable for pages ${page} to ${endPage} of type ${type}`)
  return Observable.defer(async () => {
    // return null;
    const url = urlForType(type);
    return getPage(url, page, endPage, pageSize);
    // const { pageInfo, entities } = await getPage(url, page, pageSize);
    // if (pageInfo.done) return Observable.from(entities);
    // return Observable.from(entities);
    // // return Observable.concat(Observable.from(entities), observableForPagesAndType(pageInfo.page + 1, pageInfo.pageSize, type));
    // }))
  }).concatMap((page) => {
    const { pageInfo, entities } = page;
    if (pageInfo.done) return Observable.from(entities);
    // return Observable.from(entities);
    return Observable.concat(Observable.from(entities), observableForPagesAndType(pageInfo.page + 1, endPage, pageInfo.pageSize, type));
        // }))

  });
}
