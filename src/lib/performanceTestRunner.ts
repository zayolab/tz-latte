import { TestRunner } from './testRunner';
import { TestStats } from './teststats';
import { Scenario } from './scenario';
import { Formatter } from './formatters/formatter';
import { Transport } from './transports/transport';
import { JsonFormatter } from './formatters/jsonFormatter';
import { CsvFormatter } from './formatters/csvFormatter';
import { FileTransport } from './transports/fileTransport';

export class PerformanceTestRunner implements TestRunner {
    
    private transports: Transport[];
    private formatters: Formatter[];
    private payloads: any[];
    private scenarios: Scenario[];
    // private results: TestStats[];
    private results: any[];

    constructor() {
        this.transports = new Array<Transport>();
        this.formatters = new Array<Formatter>();
        this.payloads = new Array();
        this.scenarios = new Array<Scenario>();
        this.results = new Array();
    }

    /**
     * Loads the specified transports.
     * @param transport 
     */
    loadTransport(transport: String | Transport): void {
        if (transport instanceof String) {
            // Load the default transports.
            switch (transport) {
                case 'file':
                this.transports.push(new FileTransport());
                break;
                default:
                break;
            }
        } else {
            // Load custom transport.
            this.transports.push(transport);
        }
    }

    /**
     * Loads the specified formatters.
     * @param formatter 
     */
    loadFormatter(formatter: String | Formatter): void {
        if (formatter instanceof String) {
            // Load the default formatters.
            switch (formatter) {
                case 'JSONFormatter':
                    this.formatters.push(new JsonFormatter());
                    break;
                case 'CSVFormatter':
                    this.formatters.push(new CsvFormatter());
                    break;
                default:
                    // this.formatters.push(formatter);
                    break;
            }
        } else {
            // Load custom formatter.
            // console.log(formatter);
            this.formatters.push(formatter);
        }
    }
    
    /**
     * Loads a test scenario.
     * @param name 
     * @param callback 
     */
    loadScenario(name: string, callback: () => any): void {
        this.scenarios.push({
            name,
            callback
        });
    }

    /**
     * Loads a payload for a test phase. This payload would be passed on to every scenario during a phase.
     * @param payload 
     */
    loadPayload(payload: any) {
        this.payloads.push(payload);
    }

    /**
     * This method executes the test
     */
    async run() {
        return new Promise(async(resolve, reject) => {
            try {
                console.log('Tests running...');
                // Grab the payload for every phase
                for (let phase in this.payloads) {
                    console.log(`\nRunning phase: ${phase} --`);
                    for (let scenario of this.scenarios) {
                        console.log(`\nRunning scenario: ${scenario.name} ---`);
                        this.results.push(await scenario.callback(this.payloads[phase]));
                    }
                }
                resolve(true);
            } catch (error) {
                reject(error.message);
            }
        });
    }

    /**
     * This method generates the report for the tests.
     */
    async generateReport() {
        // Dump the report on the console
        // console.log(this.results);
        // Go through each transport
        this.transports.forEach(async (transport) => {
            // Go through each formatter
            // console.log(this.formatters.length);
            this.formatters.forEach(async (formatter) => {
                if (formatter instanceof JsonFormatter) {
                    console.log('Writing JSON file...');
                    await transport.write(formatter.format(this.results), { file: './perftest.results.json'});
                } else if (formatter instanceof CsvFormatter) {
                    console.log('Writing CSV file...');
                    await transport.write(formatter.format(this.results), { file: './perftest.results.csv'});
                } else {
                    await transport.write(formatter.format(this.results), {});
                }
            });
        });
    }
}
