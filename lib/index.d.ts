import { Actionable, Readable } from 'memux';
export default function start(): Readable<Actionable & {
    progress: {
        offset: number;
        partition: number;
        topic: string;
    };
}>;
