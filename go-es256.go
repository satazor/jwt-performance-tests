package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lestrrat-go/jwx/v2/jwk"
)

func main() {
	var emailsFile, _ = ioutil.ReadFile("./emails.json")
	var emails []string

	json.Unmarshal([]byte(emailsFile), &emails)

	var publicKey = "{\"x\": \"7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg\", \"y\": \"dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU\", \"alg\": \"ES256\", \"crv\": \"P-256\", \"kid\": \"cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3\", \"kty\": \"EC\"}"
	var privateKey = "{\"alg\":\"ES256\",\"crv\":\"P-256\",\"d\":\"h-UIda1elff-qw81gsSQakyzOv8Dozv5RcQqFIV6R1Y\",\"kid\":\"cdd2969c-7e49-4a46-bcbe-e8bbdf74c7f3\",\"kty\":\"EC\",\"x\":\"7-INQ150R-MCWlj5X_wyGLRIRYAA-o8NakJiUq7gOGg\",\"y\":\"dM-GsyJvdDOuALE3l-U9lPL8V3gY_5BPjLH539yTdKU\"}"

	var publicKeyJwk, _ = jwk.ParseKey([]byte(publicKey))
	var privateKeyJwk, _ = jwk.ParseKey([]byte(privateKey))

	var rawPublicKey interface{}
	publicKeyJwk.Raw(&rawPublicKey)

	var rawPrivateKey interface{}
	privateKeyJwk.Raw(&rawPrivateKey)

	var numIterations, _ = strconv.Atoi(os.Args[1])
	var startTS int64 = time.Now().UnixMilli()
	var emailsIdx = 0
	var emailsLength = len(emails)

	for i := 0; i < numIterations; i++ {
		if i == 10000 {
			startTS = time.Now().UnixMilli()
		}

		nowSeconds := time.Now().UnixMilli() / 1000
		sub := emails[emailsIdx]

		token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
			"sub": sub,
			"iat": nowSeconds,
			"exp": nowSeconds + 7200,
		})
		tokenString, _ := token.SignedString(rawPrivateKey)

		token2, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return rawPublicKey, nil
		})

		claims, _ := token2.Claims.(jwt.MapClaims)

		if claims["sub"] != sub {
			os.Exit(1)
		}

		emailsIdx++

		if emailsIdx >= emailsLength {
			emailsIdx = 0
		}
	}

	var endTS = time.Now().UnixMilli()
	var diff = endTS - startTS

	fmt.Printf("%d iterations took %d ms", numIterations, diff)
}
