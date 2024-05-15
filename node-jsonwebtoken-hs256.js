import jwt from 'jsonwebtoken';
import { createSecretKey } from 'node:crypto';
import fs from 'node:fs';

const emails = JSON.parse(fs.readFileSync('./emails.json').toString());

const secretKey = createSecretKey('bmtXKKngXH1HRdshrI7LkJxmyNZyDN1f');

const signOptions = { algorithm: 'HS256' };
const verifyOptions = { algorithms: ['HS256'] };
const numIterations = parseInt(process.argv[2]);
let startTS = Date.now();
let emailsIdx = 0;
const emailsLength = emails.length;

for (let i = 0; i < numIterations; i++) {
  if (i === 10000) {
    startTS = Date.now()
  }

  const nowSeconds = Math.round(Date.now() / 1000);
  const sub = emails[emailsIdx];

  const token = jwt.sign({
    sub,
    iat: nowSeconds,
    exp: nowSeconds + 7200,
  }, secretKey, signOptions);

  const claims = jwt.verify(token, secretKey, verifyOptions);

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
