import { Observable } from '@reactivex/rxjs';
import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
export declare function mine(type: Types.Types, startPage?: number, endPage?: number, pageSize?: number): Observable<Doc>;
