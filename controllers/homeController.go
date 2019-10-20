package controllers

import (
	"github.com/kiwsan/io/utils"
	"net/http"
)

func GetHandler(w http.ResponseWriter, r *http.Request) {
	utils.ExecuteTemplate(w, "index.html", nil)
}

func PostHandler(w http.ResponseWriter, r *http.Request) {
}

func PutHandler(w http.ResponseWriter, r *http.Request) {
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
}
