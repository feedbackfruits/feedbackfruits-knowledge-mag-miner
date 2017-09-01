import { Subscription } from '@reactivex/rxjs';
export declare type MinerConfig = {
    name: string;
    types?: Array<'FieldOfStudy' | 'Paper'>;
};
export default function init({name, types}: MinerConfig): Promise<Subscription>;
