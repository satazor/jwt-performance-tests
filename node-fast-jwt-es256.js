import { createSigner, createVerifier } from 'fast-jwt';
import { createPrivateKey, createPublicKey } from 'node:crypto';
import fs from 'node:fs';

const emails = JSON.parse(fs.readFileSync('./emails.json').toString());

const publicKey = JSON.parse('{"x": "7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg", "y": "dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU", "alg": "ES256", "crv": "P-256", "kid": "cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3", "kty": "EC"}');
const privateKey = JSON.parse('{"alg":"ES256","crv":"P-256","d":"h-UIda1elff-qw81gsSQakyzOv8Dozv5RcQqFIV6R1Y","kid":"cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3","kty":"EC","x":"7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg","y":"dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU"}');

const publicKeyPem = createPublicKey({ format: 'jwk', key: publicKey }).export({ format: 'pem', type: 'spki' });
const privateKeyPem = createPrivateKey({ format: 'jwk', key: privateKey }).export({ format: 'pem', type: 'pkcs8' });

const signSync = createSigner({ key: privateKeyPem, algorithm: privateKey.alg });
const verifySync = createVerifier({ key: publicKeyPem, algorithms: [publicKey.alg] });

const numIterations = parseInt(process.argv[2]);
let startTS = Date.now();
let emailsIdx = 0;
const emailsLength = emails.length;


for (let i = 0; i < numIterations; i++) {
  if (i === 10000) {
    startTS = Date.now()
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const sub = emails[emailsIdx];

  const token = signSync({
    sub,
    iat: nowSeconds,
    exp: nowSeconds + 7200,
  });

  const claims = verifySync(token);

  if (claims.sub !== sub) {
    process.exit(1);
  }

  emailsIdx += 1;

  if (emailsIdx >= emailsLength) {
    emailsIdx = 0;
  }
}

const endTS = Date.now();
const diff = endTS - startTS;

console.log(`${numIterations} iterations took ${diff} ms`);
