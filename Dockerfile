FROM nginx
COPY . /usr/share/nginx/html

# tell docker what port to expose
EXPOSE 8000
