import { TypedArray } from "../typedArray";

export interface Transport {
    /**
     * Write formatted data to to a transport.
     * @param data the formatted data represented as a string.
     * @param options the options for writing the data
     */
    write(data: string | Buffer | TypedArray | DataView, options: any ): void;
}