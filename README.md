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

**Start a development server with HMR**

```bash
npm run ssr:serve
```

**Build for production**

```bash
npm run ssr:build
```

**Start in production mode** (need a `npm run ssr:build` before)

```bash
npm run ssr:start
```

**Generate a static website**

```bash
npm run ssr:static
```

**Try to fix code to be SSR compatible**

```bash
npm run ssr:fix
```

**Try to fix Vuex states to be SSR compatible**

```bash
npm run ssr:fix-vuex
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
