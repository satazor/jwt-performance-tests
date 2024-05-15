import jwt from 'jsonwebtoken';
import { createPrivateKey, createPublicKey } from 'node:crypto';

const publicKey = JSON.parse('{"x": "7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg", "y": "dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU", "alg": "ES256", "crv": "P-256", "kid": "cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3", "kty": "EC"}');
const privateKey = JSON.parse('{"alg":"ES256","crv":"P-256","d":"h-UIda1elff-qw81gsSQakyzOv8Dozv5RcQqFIV6R1Y","kid":"cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3","kty":"EC","x":"7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg","y":"dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU"}');

const publicKeyObject = createPublicKey({ format: 'jwk', key: publicKey });
const privateKeyObject = createPrivateKey({ format: 'jwk', key: privateKey });

const signOptions = { algorithm: privateKey.alg };
const verifyOptions = { algorithms: [publicKey.alg] };
const sub = 'foo@bar.com';
const numIterations = parseInt(process.argv[2]);
let startTS = Date.now();

for (let i = 0; i < numIterations; i++) {
  if (i === 10000) {
    startTS = Date.now()
  }

  const nowSeconds = Math.round(Date.now() / 1000);

  const token = jwt.sign({
    sub,
    iat: nowSeconds,
    exp: nowSeconds + 7200,
  }, privateKeyObject, signOptions);

  const claims = jwt.verify(token, publicKeyObject, verifyOptions);

  if (claims.sub !== sub) {
    process.exit(1);
  }
}

const endTS = Date.now();
const diff = endTS - startTS;

console.log(`${numIterations} iterations took ${diff} ms`);
