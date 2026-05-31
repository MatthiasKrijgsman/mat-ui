#!/bin/bash
cd /Users/matthiaskrijgsman/WebStormProjects/mat-ui/site
export PATH="$HOME/.nvm/versions/node/v24.1.0/bin:$PATH"
exec "$HOME/.nvm/versions/node/v24.1.0/bin/node" ./node_modules/next/dist/bin/next dev
