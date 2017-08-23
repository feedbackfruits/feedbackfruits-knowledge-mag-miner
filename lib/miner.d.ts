import { Observable } from '@reactivex/rxjs';
import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Context from './context';
export declare type Page<T> = {
    entities: T[];
};
export declare function mine(type: Context.Types, startPage?: number, endPage?: number, pageSize?: number): Observable<Doc>;
