package routes

import (
	"github.com/gorilla/mux"
	"github.com/kiwsan/io/controllers"
)

func NewRouter() *mux.Router {

	r := mux.NewRouter()

	//home controller
	r.HandleFunc("/", controllers.GetHandler).Methods("GET")

	return r
}
