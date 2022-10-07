# Tasks

## build

```bash
apt install -y clang
mkdir -p ./target/debug
cp ../lib/libfdb_c.x86_64.so ./target/debug/libfdb_c.so
# export STC_LINK_SEARCH_FDB_CLIENT_LIB=${pwd}/target/debug/libfdb_c.so
cargo build
```

## run

```bash
export FDB_CLUSTER_FILE=$(pwd)/../fdb.cluster
cargo run
```

### clang

```bash
apt install -y clang
sudo eopkg install llvm-clang
```
