#!/usr/bin/env node --expose-gc --max-old-space-size=8192

// const { PerformanceTestRunner } = require('../dist/lib/performanceTestRunner.js');
const { ScenarioRunner } = require('../dist/lib/scenarioRunner.js');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');
const path = require('path');

let configFile;
let config = {};
let scenariosBase;
let transportNames = [];    // String array
let transports = [];        // The array of transports
let scenarioNames = [];     // String array
let formatterNames = [];    // String array
let formatters = [];        // The array of formatters

// Package Defaults
const DEFAULT_TRANSPORTS_LOC = `${path.dirname(require.main.filename).replace(/\/bin/g, '')}/dist/lib/transports`;
const DEFAULT_FORMATTERS_LOC = `${path.dirname(require.main.filename).replace(/\/bin/g, '')}/dist/lib/formatters`;
const PROJECT_BASE = path.resolve('.');

// console.log(DEFAULT_TRANSPORTS_LOC);
// console.log(DEFAULT_FORMATTERS_LOC);
// console.log(PROJECT_BASE);

// Instantiate a test runner
// let myRunner = new PerformanceTestRunner();

/* MIDDLEWARES */
/**
 * Middleware to load the test options from the commandline arguments or the configuration file.
 */
function loadOptions(argv) {
    console.log('Loading options...');
    // Load config file
    configFile = argv['config-file'];
    try {
        config = safeLoad(readFileSync(configFile, 'utf8'));
        // console.log(JSON.stringify(config));
    } catch (error) {
        console.error(`Cannot load options from file. ${error.message}`);
        process.exit(1);
    }
}

/**
 * Middleware to load the arguments passed by the user to override.
 * @param {*} argv
 */
function loadOverrideArgs(argv) {
    console.log('Loading overrides...');
    scenariosBase = argv.base || config.config.base;
    // payloadFile = argv['payload-file'] || config.config.payloadFile;
    transportNames = argv.transports || config.config.transports;
    formatterNames = config.config.formatters;
    scenarioNames = config.scenarios;

    config = {
        base: scenariosBase,
        // payloadFile,
        transports: transportNames,
        formatters: formatterNames,
        scenarios: scenarioNames
    };
    // console.log(JSON.stringify(config));
}

/**
 * Middleware to load the transports
 * @param {*} argv
 */
function loadTransports(argv) {
    console.log('Logging transports...');
    try {
        config.transports.forEach((transport) => {
            if (transport === 'file') {
                const { FileTransport } = require(`${DEFAULT_TRANSPORTS_LOC}/fileTransport.js`);
                transports.push(new FileTransport());
            } else {
                // Load custom transport.
                const CustTransport = require(transport);
                transports.push(new CustTransport());
            }
        });
    } catch (error) {
        console.error(`Cannot load transports. ${error.message}`);
        process.exit(1);
    }
}

/**
 * Middleware to load the formatters
 * @param {*} argv
 */
function loadFormatters(argv) {
    console.log('Loading formatters...');
    try {
        config.formatters.forEach((formatter) => {
            // Load wellknown formatters first
            if (formatter.name === 'JSONFormatter') {
                const { JsonFormatter } = require(`${DEFAULT_FORMATTERS_LOC}/jsonFormatter.js`);
                formatters.push(new JsonFormatter());
            } else if (formatter.name === 'CSVFormatter') {
                const { CsvFormatter } = require(`${DEFAULT_FORMATTERS_LOC}/csvFormatter.js`);
                formatters.push(new CsvFormatter());
            } else {
                // Load custom formatter.
                const CustFormatter = require(formatter.name);
                // myRunner.loadFormatter(new CustFormatter());
                formatters.push(new CustFormatter());
            }
        });
        // console.log(config);
    } catch (error) {
        console.error(`Cannot load formatters. ${error.message}`);
        process.exit(1);
    }
}

/**
 * This method runs the test runner.
 * @param {*} argv
 */
async function run(argv) {
    let name;
    let base;
    let scenarioPath;
    let callback;

    for (let scenario of config.scenarios) {
        try {
            name = scenario.name;
            console.log(`\nName: ${name}`);
            base = path.normalize(`${PROJECT_BASE}/${scenariosBase}/${scenario.base}`);
            console.log(`Base: ${base}`);
            let scenarioRunner = new ScenarioRunner();
            // Load transports
            transports.forEach((transport) => {
                scenarioRunner.loadTransport(transport);
            });
            // Load Formatters
            formatters.forEach((formatter) => {
                scenarioRunner.loadFormatter(formatter);
            });
            // Load scenario
            scenarioPath = path.normalize(`${base}/scenario.js`);
            // console.log(scenarioPath);
            callback = require(scenarioPath);
            scenarioRunner.loadScenario({ name, base, callback });
            // Load payloads
            scenarioRunner.loadPayload();
            // Run scenarios
            await scenarioRunner.run();
            // Generate reports
            console.log('\n\nWriting reports...');
            await scenarioRunner.generateReport();
        } catch (error) {
            console.error(`Error running scenario: ${scenario}. Message: ${error.message}`);
        }
    }
    // Terminate tests
    console.log('\nTests complete...');
    process.exit(0);
}

const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -c [string] -p [string]')
    .options({
        'config-file': {
            describe: 'The configuration file used to load the tests',
            default: './perftest.config.yml',
            type: 'string'
        },
        base: {
            describe: 'Path to the scenarios directory',
            type: 'string'
        },
        transports: {
            describe: 'Transport(s) are used to send reports off to various destinations',
            type: 'array'
        },
    })
    .help()
    .alias('v', 'version')
    .alias('h', 'help')
    .example('$0 --transports file --formatters JSON CSV XML --payload ./mypayload.json --base ./path/to/my/scenarios',
        'Specify the file transport, 3 formatters, the location to the payload file and directory where the test scenarios are located.')
    .wrap(120)
    .command(['run', '*'], 'the default command', () => {}, run)
    .middleware([
        loadOptions,
        loadOverrideArgs,
        loadTransports,
        loadFormatters])
    .argv;
