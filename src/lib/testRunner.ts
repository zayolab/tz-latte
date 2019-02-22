import { Runnable } from "./runnable";
import { Formatter } from "./formatters/formatter";
import { TestStats } from "./teststats";
import { Transport } from "./transports/transport";
import { Scenario } from "./scenario";

export interface TestRunner extends Runnable {

    /**
     * This method load up a test scenario.
     * @param scenario 
     */
    loadScenario(scenario: Scenario): void;

    /**
     * This method is used to load the test payload.
     */
    loadPayload(payload?: any): void;

    /**
     * This method is used to load a formatter.
     * @param formatter 
     */
    loadFormatter(formatter: String | Formatter): void;

    /**
     * This method is used to load a report transport.
     * @param transport 
     */
    loadTransport(transport: String | Transport): void;

    /**
     * This method is used to generate reports from the test results.
     * This would essentially go through all the registered transports and 
     * output the formatted results.
     */
    generateReport(): void;

}