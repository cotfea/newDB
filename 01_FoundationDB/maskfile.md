# Tasks For RetWutter

## hello

```sh
echo Hello World!!!
```

## run-dev

```sh
podman run --rm -ti \
  --name foundationdb \
  -v $(pwd):/root/dev \
  mooxe/dev \
  /bin/bash
```

## download

```bash
export fdb_version=7.1.7
rm -rf ./bin ./lib
mkdir -p ./lib
curl -o ./lib/libfdb_c.so \
  "https://download.fastgit.org/apple/foundationdb/releases/download/${fdb_version}/libfdb_c.x86_64.so"
mkdir -p ./bin
curl -o ./bin/fdbcli \
  "https://download.fastgit.org/apple/foundationdb/releases/download/${fdb_version}/fdbcli.x86_64"
curl -o ./bin/fdbserver \
  "https://download.fastgit.org/apple/foundationdb/releases/download/${fdb_version}/fdbserver.x86_64"
chmod +x ./bin/*
```

## server

```bash
./bin/fdbserver -l 0.0.0.0:4500 -p 0.0.0.0:4500 -d ./data/ -L ./data/logs
```

## client

```bash
./bin/fdbcli
```

## deno

```bash
deno run -A --unstable ./deno/main.js
```

### fdb

```
fdb> configure new single ssd
fdb> writemode on
fdb> set hello world
fdb> get hello
```
