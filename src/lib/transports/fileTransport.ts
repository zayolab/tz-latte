import { Transport } from './transport';
import { writeFile, writeFileSync } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

export class FileTransport implements Transport {
    private static _instance: FileTransport;

    /**
     * Implements the singleton pattern.
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    write(data: string, options): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log('In FileTransport:')
                // console.log(data);
                // console.log(options.file);
                // await writeFileAsync(options.file, data, options);
                writeFileSync(options.file, data);
                resolve();
                // writeFileAsync(options.file, data, options)
                //     .then(() => {
                //         resolve();
                //     })
            } catch (error) {
                console.error(error.message);
                reject(error);
            }
        });
    }
}

