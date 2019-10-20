package controllers

import (
	"github.com/kiwsan/io/utils"
	"net/http"
)

func HomeGetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "index.html", nil)
}

func HomePostHandler(w http.ResponseWriter, r *http.Request) {
}

func HomePutHandler(w http.ResponseWriter, r *http.Request) {
}

func HomeDeleteHandler(w http.ResponseWriter, r *http.Request) {
}
