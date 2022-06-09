# Tasks

## openbeer

```bash
rm -rf ./OpenBeer.gz
curl -O https://raw.fastgit.org/ArcadeData/arcadedb-datasets/main/orientdb/OpenBeer.gz
```

## docker

```bash
podman run --rm \
  --name arcadedb \
  -p 2480:2480 \
  -p 2424:2424 \
  -v ${PWD}/OpenBeer.gz:/root/db/OpenBeer.gz \
  -e arcadedb.server.rootPassword=netserver \
  -e "arcadedb.server.defaultDatabases=OpenBeer[root]{import:file:///root/db/OpenBeer.gz}" \
  arcadedata/arcadedb:latest
```
