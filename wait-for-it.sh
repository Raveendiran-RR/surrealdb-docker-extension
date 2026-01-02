#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until curl -sSf "http://$host"; do
  >&2 echo "SurrealDB is unavailable - sleeping"
  sleep 1
done

>&2 echo "SurrealDB is up - executing command"
exec $cmd
