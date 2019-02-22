import { TestRunner } from "./testRunner";
import { Scenario } from "./scenario";
import { readFileSync } from 'fs';
import { Formatter } from './formatters/formatter';
import { Transport } from './transports/transport';
import { JsonFormatter } from './formatters/jsonFormatter';
import { CsvFormatter } from './formatters/csvFormatter';
// import * as throng from 'throng';

// let pool = workerpool.pool();

export class ScenarioRunner implements TestRunner {
    private transports: Array<Transport>;
    private formatters: Array<Formatter>;
    private scenario: Scenario;
    private base: String;
    private payloads: any[];
    private results: any[];
    // private subprocess: ChildProcess;

    static childResponded: boolean = false;

    constructor() {
        this.transports = new Array<Transport>();
        this.formatters = new Array<Formatter>();
        this.payloads = new Array();
        this.results = new Array();
    }
    
    /**
     * Loads a single scenario.
     * @param scenario 
     */
    loadScenario(scenario: Scenario): void {
        this.scenario = scenario;
    }    
    
    /**
     * Loads the payload associated with the scenario.
     */
    loadPayload(): void {
        let payloadFile = `${this.scenario.base}/payload.json`;
        this.payloads = JSON.parse(readFileSync(payloadFile, 'utf8'));
    }

    /**
     * 
     * @param formatter 
     */
    loadFormatter(formatter: Formatter): void {
        this.formatters.push(formatter);
    }

    /**
     * 
     * @param transport 
     */
    loadTransport(transport: Transport): void {
        this.transports.push(transport);
    }

    /**
     * 
     */
    async generateReport() {
        // Go through each transport
        this.transports.forEach(async (transport) => {
            // Go through each formatter
            this.formatters.forEach(async (formatter) => {
                if (formatter instanceof JsonFormatter) {
                    console.log('Writing JSON file...');
                    let file = `${this.scenario.base}/results.json`;
                    await transport.write(formatter.format(this.results), { file });
                } else if (formatter instanceof CsvFormatter) {
                    console.log('Writing CSV file...');
                    let file = `${this.scenario.base}/results.csv`;
                    await transport.write(formatter.format(this.results), { file });
                } else {
                    await transport.write(formatter.format(this.results), {});
                }
            });
        });
    }

    async run() {
        return new Promise(async(resolve, reject) => {
            try {
                console.log('Tests running...');
                // Grab the payload for every phase
                for (let phase in this.payloads) {
                    console.log(`\nRunning phase: ${phase} --`);
                    this.results.push(await this.scenario.callback(this.payloads[phase]));
                    // this.results.push(await pool.exec(this.scenario.callback, [this.payloads[phase]]));
                    // let result;
                    // throng(async (id) => {
                    //     result = await this.scenario.callback(this.payloads[phase]);
                    //     console.log(result);
                    // });

                }
                resolve(true);
            } catch (error) {
                reject(error.message);
            }
        });
    }
}
