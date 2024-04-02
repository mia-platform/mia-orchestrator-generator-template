# TODO

**DONE**

- Create a Lambda-type template for the pipeline. - Cloud Formation version
- Create a EC2-type template for the pipeline.**

**WIP**

- Create a deployment template using the Lambda template. (Project template needs to be created and the pipeline needs to be connected in feat-aws-templates)
- Handle multiple handlebar files, one for each resource type, with selection based on the service label that indicates the type. (Code done, complete test with different files missing)

**TODO**

- Add parsing for all [Console Schemas](https://docs.mia-platform.eu/docs/console/company-configuration/providers/extensions/orchestrator-generator/overview#service-data-model)
- Add more example in templates
- Improve code splitting responsibility of parsing Console POST and file generator
- Improve tests!
- Connect the creation of DocumentDB and endpoints to expose a service and connect a CRUD.
- Create an end-to-end application in the marketplace: Lambda, EC2, DocumentDB, CRUD, pod on K8s, CDN microfe composer (a series of handlebar templates)
