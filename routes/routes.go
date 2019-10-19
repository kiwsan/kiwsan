package routes

import (
	"github.com/gorilla/mux"
	"github.com/kiwsan/io/utils"
	"net/http"
	"os"
	"path"
)

func NewRouter() *mux.Router {
	rootDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	// This is the only way I have found to be able to serve images requested in the templates
	http.Handle("/static/images/", http.StripPrefix("/static/images/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/images/")))))

	http.Handle("/static/css/", http.StripPrefix("/static/css/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/css/")))))

	http.Handle("/static/js/", http.StripPrefix("/static/js/",
		http.FileServer(http.Dir(path.Join(rootDir, "/static/js/")))))

	r := mux.NewRouter()
	r.HandleFunc("/", indexHandler).Methods("GET")

	return r
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "index.html", nil)
}
