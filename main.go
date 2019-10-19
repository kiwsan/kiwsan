package main

import (
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"os"
	"path"
)

var templates *template.Template

func main() {
	print("Hello world")

	rootDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	templates = template.Must(template.ParseGlob("templates/*.html"))

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
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	err := templates.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
