# jwt-performance-tests

Micro-benchmark on JWT signing and verification on Node.js and Go.

## Results

- Node.js: v22.1.0
- Go: v1.22.1
- Hardware: Apple M3 Pro with 32GB RAM

### Symmetric key using `HS256`:

How much time it takes to sign and verify 1.000.000 JWTs using `HS256` algorithm:

```bash
$ node node-jsonwebtoken-hs256.js 1000000
# 1000000 iterations took 7771 ms

$ node node-fast-jwt-hs256.js 1000000
# 1000000 iterations took 5621 ms

$ go run go-hs256.go 1000000
# 1000000 iterations took 3621 ms
```

Go is 1.55x faster than Node.js.   
Go uses less memory than Node.js (15MB vs 62MB) albeit Node.js has a higher base memory (~40MB).

### Asymmetric key using `ES256`:

How much time it takes to sign and verify 1.000.000 JWTs using `ES256` algorithm:

```bash
$ node node-jsonwebtoken-es256.js 1000000
# 1000000 iterations took 66171 ms

$ node node-fast-jwt-es256.js 1000000
# 1000000 iterations took 61768 ms

$ go run go-es256.go 1000000
# 1000000 iterations took 59875 ms
```

Go is 1.03x faster than Node.js.   
Go uses less memory than Node.js (15MB vs 62MB) albeit Node.js has a higher base memory (~40MB).
