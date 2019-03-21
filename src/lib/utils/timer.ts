/**
 * Utility class for measuring time.
 */
export class Timer {
    private static NS_PER_SEC = 1e9;
    private static  MS_PER_SEC = 1e6;
    private globalStartTime: Date;
    private startTime: [number, number];
    private lastRecTime: [number, number];

    constructor() {
        this.globalStartTime = new Date();
    }

    /**
     * Method used to start the timer.
     */
    start() {
        this.startTime = process.hrtime();
        this.lastRecTime = this.startTime;
        return this.startTime;
    }

    /**
     * Returns the HR interval elapsed since last interval.
     */
    intervalHR() {
        let now = process.hrtime();
        let diff = process.hrtime(this.lastRecTime);
        this.lastRecTime = now;
        return diff;
    }

    /**
     * Returns the milliseconds interval elapsed since last interval.
     */
    intervalMS() {
        let now = process.hrtime();
        let diff = process.hrtime(this.lastRecTime);
        this.lastRecTime = now;
        return ((diff[0] * Timer.NS_PER_SEC) + diff[1]) / Timer.MS_PER_SEC;
    }

    /**
     * Sleeps for the specified amount of time.
     * @param {number} ms the sleep time in milliseconds
     */
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, ms);
        });
    }
}
