import { request } from 'request-promise-native';
const _ = require('lodash');

/**
 * Pause for `ms` seconds
 * @param {*} ms
 */
function sleep(ms) {
    // console.log(`Waiting for ${ms} ms...`);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Wraps an HTTP request as a promise.
 * @param {*} options request options
 * @param {*} pauseTime pause time between each requests
 */
function requestWrapper(options, pauseTime) {
    let start = new Date();
    return new Promise(async (resolve, reject) => {
        try {
            let data = await request(options);
            await sleep(pauseTime);
            resolve({
                type: 'success',
                data,
                time: new Date() - start
            });
        } catch (error) {
            console.error(error);
            resolve({
                type: 'error',
                data,
                time: new Date() - start
            });
        }
    });
}

/**
 * Time taken to resolve all the promises.
 * @param {*} start time when all the promises were started.
 * @param {*} promises a list of promises.
 */
function getPromiseResolveTime(start, promises) {
    return new Promise(async (resolve, reject) => {
        try {
            let responses = await Promise.all(promises);
            resolve({
                totalTime: new Date() - start,
                responses
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Calculates the median value of an array of numbers.
 * @param {number} arr the array of numbers
 */
function median(arr) {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

/**
 * Initialize the tests.
 */
async function initTests() {
    return await sleep(2000);
}

module.exports = {
    sleep,
    getPromiseResolveTime,
    initTests,
    median,
    requestWrapper
}