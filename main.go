package main

import (
	"io/routes"
	"io/utils"
	"net/http"
)

func main() {

	utils.LoadTemplates("templates/*.html")

	r := routes.NewRouter()
	http.Handle("/", r)

	http.ListenAndServe(":8000", nil)
	print("listening to port 8000")

}
