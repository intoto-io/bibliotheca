#!/bin/bash
CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" == "master" ]]; then
  source .env
  npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
  npm publish --workspaces
else
  echo "Aborting publishing because you are not on the master branch."
fi


