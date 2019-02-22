import { TestStats } from "../teststats";

export interface Formatter {
    /**
     * This method formats the test results and produces a stringified output.
     * @param results the test results
     */
    format(results: any[]): string;
}