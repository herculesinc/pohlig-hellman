// IMPORTS
// ================================================================================================
import { BigInteger } from 'jsbn';
import * as forge from 'node-forge';
import {bigIntToBuffer, bufferToBigInt, BIG_INT_ONE} from './biUtil';

// PUBLIC FUNCTION
// ================================================================================================
export async function generateKey(prime: Buffer, bitLength = 256): Promise<Buffer> {
    // TODO: validate parameters

    const randomBytes = Buffer.from( forge.random.getBytesSync(bitLength >> 3) );

    let key = bufferToBigInt(randomBytes);

    if (key.isEven()) {
        key = key.add(BIG_INT_ONE);
    }

    return bigIntToBuffer(key);

    // return new Promise((resolve, reject) => {
    //     crypto.randomBytes(byteLength, (error, buf) => {
    //         if (error) {
    //             return reject(error);
    //         }
    //
    //         console.log( 'key', buf.toString('hex') )
    //
    //         // TODO: make sure a valid key has been generated
    //
    //         let key = new BigInteger(buf.toString('hex'), 16);
    //         if (key.isEven()) {
    //             key = key.add(ONE);
    //         }
    //
    //         resolve(key);
    //     });
    // });
}
