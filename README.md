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
# 1000000 iterations took 6385 ms

$ node node-fast-jwt-hs256.js 1000000
# 1000000 iterations took 4590 ms

$ go run go-hs256.go 1000000
# 1000000 iterations took 3621 ms 1000000
```

Go is 1.26x faster than Node.js.
Go uses less memory than Node.js (15MB vs 62MB) albeit Node.js has a higher base memory (~40MB).

### Asymmetric key using `ES256`:

How much time it takes to sign and verify 1.000.000 JWTs using `ES256` algorithm:

```bash
$ node node-jsonwebtoken-es256.js 1000000
# 1000000 iterations took 61996 ms

$ node node-fast-jwt-es256.js 1000000
# 1000000 iterations took 59222 ms

$ go run go-es256.go 1000000
# 1000000 iterations took 58737 ms
```

Go has same performance compared to Node.js.
Go uses less memory than Node.js (15MB vs 62MB) albeit Node.js has a higher base memory (~40MB).
