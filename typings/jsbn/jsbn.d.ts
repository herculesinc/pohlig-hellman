declare module 'jsbn' {

    export class BigInteger {
        constructor(value: string, radix?: number);

        isEven(): boolean;

        add(value: BigInteger)      : BigInteger;
        subtract(value: BigInteger) : BigInteger;
        multiply(value: BigInteger) : BigInteger;
        divide(value: BigInteger)   : BigInteger;
        remainder(value: BigInteger): BigInteger;

        mod(modulus: BigInteger)                            : BigInteger;
        modPow(exponent: BigInteger, modulus: BigInteger)   : BigInteger;
        modInverse(modulus: BigInteger)                     : BigInteger;

        gcd(value: BigInteger)      : BigInteger;
        equals(value: BigInteger)   : boolean;
        compareTo(value: BigInteger): number;
        isProbablePrime(t: number)  : boolean;

        bitLength(): number;
        toString(radix?: number): string;
    }
}
