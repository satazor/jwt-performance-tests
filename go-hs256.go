package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func main() {
	var jwtSecret = []byte(os.Getenv("bmtXKKngXH1HRdshrI7LkJxmyNZyDN1f"))

	var sub = "foo@bar.com"
	var numIterations, _ = strconv.Atoi(os.Args[1])
	var startTS int64 = time.Now().UnixMilli()

	for i := 0; i < numIterations; i++ {
		if i == 10000 {
			startTS = time.Now().UnixMilli()
		}

		nowSeconds := time.Now().UnixMilli() / 1000

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": sub,
			"iat": nowSeconds,
			"exp": nowSeconds + 7200,
		})
		tokenString, _ := token.SignedString(jwtSecret)

		token2, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		claims, _ := token2.Claims.(jwt.MapClaims)

		if claims["sub"] != sub {
			os.Exit(1)
		}
	}

	var endTS = time.Now().UnixMilli()
	var diff = endTS - startTS

	fmt.Printf("%d iterations took %d ms", numIterations, diff)
}
