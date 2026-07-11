#!/bin/sh
set -e

# Keep the named node_modules volume in sync when package.json changes on the host.
yarn install --frozen-lockfile

exec "$@"
