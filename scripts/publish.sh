#!/bin/bash
source .env
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
lerna publish --no-private --no-verify-access
