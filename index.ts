// IMPORTS
// ================================================================================================
import { BigInteger } from 'jsbn';
import * as util from './util';

// MODULE VARIABLES
// ================================================================================================
const ONE = new BigInteger('1', 10);

// INTERFACES
// ================================================================================================
export type ModpGroup = 'modp2048' | 'modp3072' | 'modp4096' | 'modp6144' | 'modp8192';

// PUBLIC FUNCTIONS
// ================================================================================================
export async function createCipher(): Promise<Cipher>;
export async function createCipher(primeLength: number): Promise<Cipher>;
export async function createCipher(modpGroup: ModpGroup): Promise<Cipher>;
export async function createCipher(lengthOrGroup?: number | ModpGroup): Promise<Cipher> {

    let prime: BigInteger;
    if (typeof lengthOrGroup === 'number') {
        prime = util.generateSafePrime(lengthOrGroup);
    }
    else if (typeof lengthOrGroup === 'string') {
        prime = util.getPrime(lengthOrGroup);
    }
    else if (lengthOrGroup === null || lengthOrGroup === undefined) {
        prime = util.getPrime('modp2048');
    }

    const key = await util.generateKey(prime);

    return new Cipher(Buffer.from(prime.toString(16), 'hex'), Buffer.from(key.toString(16), 'hex'));
}

export function mergeKeys(key1: Buffer, key2: Buffer): Buffer {
    // TODO: validate parameters
    const k1 = new BigInteger(key1.toString('hex'), 16);
    const k2 = new BigInteger(key2.toString('hex'), 16);
    const k12 = k1.multiply(k2);
    return Buffer.from(k12.toString(16), 'hex');
}

// CIPHER DEFINITION
// ================================================================================================
export class Cipher {

    private p: BigInteger;  // prime
    private e: BigInteger;  // encryption key
    private d: BigInteger;  // decryption key
    
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(prime: Buffer, enkey: Buffer) {
        // TODO: validate parameters
        this.p = new BigInteger(prime.toString('hex'), 16);
        this.e = new BigInteger(enkey.toString('hex'), 16);
        this.d = this.e.modInverse(this.p.subtract(ONE));
        // TODO: implement validity checking for p, e, and d
    }

    // PUBLIC FUNCTIONS
    // --------------------------------------------------------------------------------------------
    encrypt(data: Buffer): Buffer {
        // TODO: validate parameters
        const m = new BigInteger(data.toString('hex'), 16);
        const c = m.modPow(this.e, this.p);
        return Buffer.from(c.toString(16), 'hex');
    }

    decrypt(data: Buffer): Buffer {
        // TODO: validate parameters
        const c = new BigInteger(data.toString('hex'), 16);
        const m = c.modPow(this.d, this.p);
        return Buffer.from(m.toString(16), 'hex');
    }

    async clone(keyBitLength?: number): Promise<Cipher> {
        const key = await util.generateKey(this.p, keyBitLength);
        return new Cipher(this.prime, Buffer.from(key.toString(16), 'hex'));
    }

    // PUBLIC MEMBERS
    // --------------------------------------------------------------------------------------------
    get prime(): Buffer {
        return Buffer.from(this.p.toString(16), 'hex');
    }

    get enkey(): Buffer {
        return Buffer.from(this.e.toString(16), 'hex');
    }

    get dekey(): Buffer {
        return Buffer.from(this.d.toString(16), 'hex');
    }
}