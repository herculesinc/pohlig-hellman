// INTERFACES
// ================================================================================================
import * as ph from './../index';

// TEST RUNNER
// ================================================================================================
test().then(() => { console.log('done!'); });

// TEST FUNCTION
// ================================================================================================
async function test() {

    let start = Date.now();
    const c1 = await ph.createCipher();
    console.log(`Created cipher in ${Date.now() - start} ms`);
    console.log(`Prime size: ${c1.prime.length * 8}, encryption key size: ${c1.enkey.length * 8}, decryption key size: ${c1.dekey.length * 8}`);

    // encrypt: data -> e1
    const data = 'San Diego, California';
    start = Date.now();
    const e1 = c1.encrypt(Buffer.from(data));
    console.log(`Encrypted data in ${Date.now() - start} ms; e1 size is ${e1.length * 8} bits`);

    // make sure e1 decrypts back to data
    start = Date.now();
    const d1 = c1.decrypt(e1);
    console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d1.toString() === data}`);

    // encrypted: e1 -> e2
    const c2 = await c1.clone();
    start = Date.now();
    const e2 = c2.encrypt(e1);
    console.log(`Encrypted data in ${Date.now() - start} ms; e2 size is ${e2.length * 8} bits`);

    // make sure e1 decypts back into e2
    start = Date.now();
    const d2 = c2.decrypt(e2);
    console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d2.toString('hex') === e1.toString('hex')}`);

    // create a cipher that has a merged key of first and second encryption
    const key12 = ph.mergeKeys(c1.enkey, c2.enkey);
    const c3 = new ph.Cipher(c1.prime, key12);
    console.log(`Prime size: ${c3.prime.length * 8}, encryption key size: ${c3.enkey.length * 8}, decryption key size: ${c3.dekey.length * 8}`);

    // decrypt e2 directly into data using the mereged key
    start = Date.now();
    const d12 = c3.decrypt(e2);
    console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d12.toString() === data}`);
    
}