package main

import (
	"github.com/kiwsan/io/bootstrapper"
	"net/http"
)

func main() {

	bootstrapper.OnStart()

	print("listening to http://localhost:8000")
	http.ListenAndServe(":8000", nil)

}
