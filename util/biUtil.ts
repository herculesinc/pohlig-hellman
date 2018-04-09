import {BigInteger} from 'jsbn';

export const BIG_INT_ONE = new BigInteger('1', 10);
export const BIG_INT_TWO = new BigInteger('2', 10);

export function bufferToBigInt(buffer: Buffer): BigInteger {
    return new BigInteger(buffer.toString('hex'), 16);
}

export function bigIntToBuffer(bi: BigInteger): Buffer {
    let result;

    try {
        result = Buffer.from(bi.toString(16).toUpperCase(), 'hex');
    } catch (e) {
        console.log(bi.toString(16));
        console.log(e);
    }

    return result;
}
