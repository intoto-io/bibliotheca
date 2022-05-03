#!/bin/bash
source .env
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm publish --workspaces
