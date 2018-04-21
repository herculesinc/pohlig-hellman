declare module "pohlig-hellman" {

    // enums
    export type ModpGroup = 'modp2048' | 'modp3072' | 'modp4096' | 'modp6144' | 'modp8192';
    export type PlaintextEncoding = 'hex' | 'base64' | 'utf8';
    export type CiphertextEncoding = 'hex' | 'base64';

    // initializes a new cipher with a random key
    export function createCipher()                      : Promise<Cipher>;
    export function createCipher(prime: Buffer)         : Promise<Cipher>;
    export function createCipher(primeLength: number)   : Promise<Cipher>;
    export function createCipher(modpGroup: ModpGroup)  : Promise<Cipher>;

    export function mergeKeys(k1: Buffer, k2: Buffer)   : Buffer;

    // Cipher class definition
    export class Cipher {

        constructor(prime: Buffer, enkey: Buffer);

        encrypt(data: Buffer): Buffer;
        encrypt(data: string, encoding?: PlaintextEncoding) : Buffer;

        decrypt(data: Buffer): Buffer;
        decrypt(data: string, encoding?: CiphertextEncoding): Buffer;

        // public properties
        readonly prime  : Buffer;
        readonly enkey  : Buffer;   // encryption key
        readonly dekey  : Buffer;   // decryption key
    }
}