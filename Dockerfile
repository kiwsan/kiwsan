FROM node:lts-alpine as develop-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
FROM develop-stage as build-stage
RUN npm run build

FROM node:lts-alpine as deploy-stage

# install simple http server for serving static content
RUN npm install -g http-server

COPY --from=build-stage /app/dist ./

EXPOSE 8080
CMD [ "http-server" ]