package bootstrapper

import (
	"github.com/kiwsan/io/routes"
	"github.com/kiwsan/io/utils"
	"net/http"
	"os"
	"path"
)

func OnStart() {

	bundle()

	utils.LoadTemplates("templates/*.html")

	r := routes.NewRouter()

	http.Handle("/", r)

}

func bundle() {

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

}
