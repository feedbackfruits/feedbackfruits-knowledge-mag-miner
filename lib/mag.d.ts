import { Observable } from '@reactivex/rxjs';
import * as Types from './types';
export declare type Page<T> = {
    pageInfo: {
        page: number;
        pageSize: number;
        done: boolean;
    };
    entities: T[];
};
export declare type FieldOfStudy = {
    Id: string;
    FN: string;
    DFN: string;
    FC: {
        FId: string;
    };
    FP: {
        FId: string;
    };
};
export declare function urlForType(type: Types.Types): string;
export declare function urlForPage(baseUrl: string, page: number, pageSize: number): string;
export declare function getPage(url: string, page: number, endPage: number, pageSize: number): Promise<Page<FieldOfStudy>>;
export declare function observableForPagesAndType(page: number, endPage: number, pageSize: number, type: Types.Types): Observable<FieldOfStudy>;
