package main

import (
	"./utils"
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"path"
)

func main() {

	rootDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	utils.LoadTemplates("templates/*.html")

	// This is the only way I have found to be able to serve images requested in the templates
	http.Handle("/static/images/", http.StripPrefix("/static/images/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/images/")))))

	http.Handle("/static/css/", http.StripPrefix("/static/css/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/css/")))))

	http.Handle("/static/js/", http.StripPrefix("/static/js/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/js/")))))

	r := mux.NewRouter()
	r.HandleFunc("/", indexHandler).Methods("GET")

	http.Handle("/", r)
	http.ListenAndServe(":8000", nil)

	print("listening to port 8000")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "index.html", nil)
}
