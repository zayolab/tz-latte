import { Formatter } from "./formatter";
import { TestStats } from "../teststats";

export class JsonFormatter implements Formatter {
    private static _instance: JsonFormatter;

    /**
     * Implements the singleton pattern.
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    format(results: any[]): string {
        return JSON.stringify(results);
    }
}