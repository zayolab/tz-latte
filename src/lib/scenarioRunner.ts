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
    private payloads: any;
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
     * This method generates the reports based on the test results.
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

    async phaseRunner(params) {
        // console.log('-- phaseRunner ---------');
        let val = await this.scenario.callback(params);
        // console.log(val);
        return val;
    }

    *phaseGenerator(payloads){

        for (let i = 0; i < payloads.phases.length; i += 1) {
            console.log(`\nRunning phase: ${ i + 1 } --`);
            let params = Object.assign(payloads.common, payloads.phases[i]);
            // console.log(params);
            yield this.phaseRunner(params);
        }

    }

    async run() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Tests running...');
                // Grab the payload for every phase
                let pg = this.phaseGenerator(this.payloads);
                let result = pg.next();
                while(!result.done) {
                    // console.log(await result.value);
                    this.results.push(await result.value);
                    result = pg.next();
                }
                resolve(true);
            } catch (error) {
                reject(error.message);
            }
        });
    }
}
