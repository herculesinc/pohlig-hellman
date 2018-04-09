declare module "pholig-hellman" {

    export type ModpGroup = 'modp2048' | 'modp3072' | 'modp4096' | 'modp6144' | 'modp8192';

    export function createCipher()                      : Promise<Cipher>;
    export function createCipher(primeLength: number)   : Promise<Cipher>;
    export function createCipher(modpGroup: ModpGroup)  : Promise<Cipher>;

    export function mergeKeys(k1: Buffer, k2: Buffer)   : Buffer;

    export class Cipher {
        constructor(prime: Buffer, enkey: Buffer);

        encrypt(data: Buffer): Buffer;
        decrypt(data: Buffer): Buffer;

        readonly prime  : Buffer;
        readonly enkey  : Buffer;
        readonly dekey  : Buffer;
    }
}