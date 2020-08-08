# kiwsan, inc.

## Quick start

Build using docker command:

```bash
$ docker build -f Dockerfile -t vuejsapp . 
```

Run using docker command:

```bash
$ docker run --rm -it -p 8088:8080 vuejsapp
```

Build and run using docker-compose:

```bash
$ docker-compose up -d
```

```bash
$ curl http://localhost:8088
```

## On Mobile screen

<img src="https://raw.githubusercontent.com/kiwsan/kiwsan/master/screenshots/iPhone%20XR%2C%20XS%20Max%2C%2011%20%E2%80%93%201.png" alt="dasktop" width="550"/>

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
