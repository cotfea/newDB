# TDengine

## start_server

```bash
podman run -d --rm \
  --name tdengine \
  -p 6030-6049:6030-6049 \
  -p 6030-6049:6030-6049/udp \
    tdengine/tdengine
```

## exec_cli

```bash
podman exec -ti tdengine bash
```

## stop_server

```bash
podman rm -f tdengine
```

## show_dbs

```bash
curl -H 'Authorization: Basic cm9vdDp0YW9zZGF0YQ==' -d \
  'show databases;' \
  http://localhost:6041/rest/sql | jq
```

## create_dbs
