# EdgeDB

## createPod

```bash
podman pod create -n edgedb
```

## removePod

```bash
podman pod rm -f edgedb
```

## edgedb-serv

```bash
podman run -d \
  --name edgedb_serv \
  --pod edgedb \
  -e EDGEDB_SERVER_SECURITY=insecure_dev_mode \
  edgedb/edgedb
```

## edgedb-auth

```bash
podman run -it --rm \
  --name edgedb_auth \
  --pod edgedb \
  -e EDGEDB_SERVER_PASSWORD=secret \
  -v edgedb-cli-config:$(pwd)/.config/edgedb edgedb/edgedb-cli \
    -H edgedb instance link my_instance
```

## edgedb-intf

```bash
podman run -it --rm \
  --name edgedb_intf \
  --pod edgedb \
  -v edgedb-cli-config:$(pwd)/.config/edgedb edgedb/edgedb-cli \
    -I my_instance
```
