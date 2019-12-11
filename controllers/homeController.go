package controllers

import (
	"github.com/kiwsan/io/utils"
	"net/http"
	"strings"
)

func HomeGetHandler(w http.ResponseWriter, r *http.Request) {

	e := "SomeKey describing content - eg checksum"
	w.Header().Set("Etag", e)
	w.Header().Set("Cache-Control", "max-age=2592000") // 30 days

	if match := r.Header.Get("If-None-Match"); match != "" {
		if strings.Contains(match, e) {
			w.WriteHeader(http.StatusNotModified)
			return
		}
	}

	utils.ExecuteTemplate(w, "index.html", nil)
}

func HomePostHandler(w http.ResponseWriter, r *http.Request) {
}

func HomePutHandler(w http.ResponseWriter, r *http.Request) {
}

func HomeDeleteHandler(w http.ResponseWriter, r *http.Request) {
}
