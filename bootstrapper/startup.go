package bootstrapper

import (
	"github.com/kiwsan/io/controllers"
	"github.com/kiwsan/io/routes"
	"github.com/kiwsan/io/utils"
	"github.com/rs/cors"
	"net/http"
	"os"
	"path"
)

func OnStart() {

	initStatics()
	initRoutes()

}

func initRoutes() {

	r := routes.NewRouter()

	// handle static files
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/",
		CacheControlWrapper(http.FileServer(http.Dir("/static/")))))

	r.NotFoundHandler = http.HandlerFunc(controllers.HomeGetHandler) // work around for SPA serving index.html

	handler := cors.Default().Handler(r)
	http.Handle("/", handler)

}

func CacheControlWrapper(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=3600")
		h.ServeHTTP(w, r)
	})
}

func initStatics() {

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

	utils.LoadTemplates("templates/*.html")

}
