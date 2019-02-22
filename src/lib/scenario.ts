import { TestStats } from "./teststats";

export type Scenario = {
    name: string,
    base?: string,
    timeout?: number,
    callback: (options?: any) => any
}