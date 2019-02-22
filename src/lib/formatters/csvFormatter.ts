import { Formatter } from "./formatter";
import { TestStats } from "../teststats";
import { Parser } from 'json2csv';

export class CsvFormatter implements Formatter {
    private static _instance: CsvFormatter;

    private fields = [
        { label: 'Number of Objects', value: 'numObjects' },
        { label: 'Number of Buckets', value: 'numBuckets' }
    ];

    private parser: Parser;

    constructor(options?: any) {
        if (options) {
            this.parser = new Parser({ fields: options.fields });
        } else {
            this.parser = new Parser();
        }
    }

    /**
     * Implements the singleton pattern.
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    format(results: any[]): string {
        // console.log(results);
        const csv = this.parser.parse(results);
        return csv;
    }
}