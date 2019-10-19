package main

import (
	"github.com/kiwsan/io/routes"
	"github.com/kiwsan/io/utils"
	"net/http"
)

func main() {

	utils.LoadTemplates("templates/*.html")

	r := routes.NewRouter()
	http.Handle("/", r)

	print("listening to http://localhost:8000")
	http.ListenAndServe(":8000", nil)

}
