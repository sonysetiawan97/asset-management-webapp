#!/bin/sh
set -e
serve -s dist -l ${PORT:-5173}
