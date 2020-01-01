# github.kiwsan.io

[![Build Status](https://travis-ci.org/kiwsan/io.svg?branch=master)](https://travis-ci.org/kiwsan/io)

## Quick start

Build using docker command:

```bash
$ docker build -f Dockerfile -t goapp . 
```

Optimize debug informations and compile only for linux target and disabling cross compilation.

| REPOSITORY | TAG | IMAGE ID | CREATED | SIZE | 
|--|--|--|--|--|
| goapp | latest | 81de301a6fa4 | 28 minutes ago | 8.37MB | 

<img src="https://github.com/kiwsan/io/blob/master/Screenshot_20191106_234848.png" alt="drawing" width="550"/>

Run using docker command:

```bash
$ docker run --rm -it -p 8000:8000 goapp
```

Build and run using docker-compose:

```bash
$ docker-compose up -d
```

```bash
$ curl http://localhost:8000
```

## Resources
- https://developers.google.com/web/fundamentals

## User story (Scrum)
- https://tree.taiga.io/project/kiwsan-io-personal-website/timeline

