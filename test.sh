#!/bin/bash
set -e

cd reactfire

yarn
yarn build
yarn test