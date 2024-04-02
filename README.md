# mia-orchestrator-generator-template

!!!This is work in progress!!!!

A starting template to build your Orchestrator Generator and connect it to Mia-Platform - https://docs.mia-platform.eu/docs/console/company-configuration/providers/extensions/orchestrator-generator/overview

## Summary

This service generates deployment file combining:

- config map named deploy.hbs with a handlebars.js template
- values that come from [Orchestrator Generator](https://docs.mia-platform.eu/docs/console/company-configuration/providers/extensions/orchestrator-generator) POST:

  - service name
  - environment variables

## Local Development

To develop the service locally you need:

- Node 18+

To setup node, please if possible try to use [nvm][nvm], so you can manage
multiple versions easily. Once you have installed nvm, you can go inside
the directory of the project and simply run `nvm install`, the `.nvmrc` file
will install and select the correct version if you don’t already have it.

Once you have all the dependency in place, you can launch:

```shell
npm ci
npm run coverage
cp ./default.env ./local.env
set -a && source local.env
npm start
```

## Test

```shell
curl -X POST \
     -H "Content-Type: application/json" \
     -d @testfiles/deploy-input.json \
     http://0.0.0.0:3000/generate
```
As a result the terminal should return you the interpolated file that can be applied by your pipeline / argocd

[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/clients/mia-platform/demo/demo-companies/digital-platform-d/mob-csm-orchestrator/services/aws-lambda-generator/merge_requests
