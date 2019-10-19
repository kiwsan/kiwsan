package main

import (
	"github.com/kiwsan/io/utils"
	"io/routes"
	"net/http"
)

func main() {

	utils.LoadTemplates("templates/*.html")

	r := routes.NewRouter()
	http.Handle("/", r)

	http.ListenAndServe(":8000", nil)
	print("listening to port 8000")

}
