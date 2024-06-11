/*
 * Copyright 2024 Mia s.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'


/**
 * How it works:
 * - Create a generic container for deployment.
 * - Place it in the marketplace, creating N cards (one for each deployment template like EC2, AWS, etc.).
 * - Publish the container within an extension project where the file generation services run.
 * - Design a project template for each deployment type, including the pipeline responsible
 *   for applying changes to EC2 or WS.
 * - Create a project based on the appropriate template.
 * - Integrate API providers tailored for the custom deployment, ensuring they point to the correct deployment logic.
 * - Develop a microservice and leverage its environment variables to fine-tune the deployment configuration.
 */

// constants
const runtimeLabel = 'mia-platform/runtime'
const templateDirectory = 'templates'
const noFileFoundMessage = 'no template found for that runtime'

// required functions
const Handlebars = require('handlebars')
Handlebars.registerHelper('removeHyphens', (str) => {
  return str.replace(/-/g, '')
})
const fs = require('fs')

// main handler (the only one in the file)
async function handler(req) {
  debugMessage('Input', req.log, { requestBody: req.body })

  // get information for the template
  const { configuration: { services } } = req.body
  const filesForGit = {}

  debugMessage('Services', req.log, { services })
  for (const serviceName in services) {
    if (serviceName) {
      const serviceDetails = services[serviceName]
      if (serviceDetails) {
        debugMessage('Parsing service', req.log, { service: serviceDetails })
        const fileNameForGitPush = `${serviceName}.yaml`
        const targetRuntime = getServiceTargetRuntime(serviceDetails, req)
        const annotationValuesForTemplate = extractServiceParametersFromAnnotations(serviceDetails, req)
        const envValuesForTemplate = extractEnvVars(serviceDetails, req)

        // prepare data for template compile and generate git file
        const dataForTemplate = {
          serviceName,
          targetRuntime,
          serviceParameters: annotationValuesForTemplate,
          envParameters: envValuesForTemplate,
          timestamp: new Date().toISOString(),
        }
        // TODO: improve it
        // eslint-disable-next-line no-await-in-loop
        const fileToPushToGit = await generateGitFile(dataForTemplate, req)
        filesForGit[fileNameForGitPush] = fileToPushToGit
      }
    }
  }
  debugMessage('Completed! This is the list of files', req.log, { filesForGit })
  return filesForGit
}

// main function
// pass values to Handlebars to generate the file for Console
async function generateGitFile(dataForTemplate, req) {
  const templateSource = await readFileIfItExists(selectTemplateByRuntime(dataForTemplate), 'utf-8')
  const template = Handlebars.compile(templateSource)
  const fileToPushToGit = template(dataForTemplate)
  debugMessage('File for Git', req.log, { file: fileToPushToGit })
  return fileToPushToGit
}

// read the template file
async function readFileIfItExists(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8')
    return data
  } catch (error) {
    return `${noFileFoundMessage} - ${filePath}`
  }
}

// parse the label runtimeLabel and return the target runtime
// that is used to select the correct template
function getServiceTargetRuntime(service, req) {
  const targetRuntime = extractServiceParametersFromLabels(service, req)[runtimeLabel]
  debugMessage('Target Runtime', req.log, { targetRuntime })
  return targetRuntime
}

// select correct template for the correct runtime
function selectTemplateByRuntime(dataForTemplate) {
  return `${templateDirectory}/${dataForTemplate.targetRuntime}.hbs`
}

// get the env vars and translate them for handlebar
function extractServiceParametersFromAnnotations(serviceDetails, req) {
  const { annotations } = serviceDetails
  return arrayOfObjectsToKeyValue(annotations, req)
}

// get the label values and translate them for handlebar
function extractServiceParametersFromLabels(serviceDetails, req) {
  const { labels } = serviceDetails
  return arrayOfObjectsToKeyValue(labels, req)
}

// transform an array of objects in keyvalue
function arrayOfObjectsToKeyValue(arrayOfObjects, req) {
  if (!arrayOfObjects || arrayOfObjects.length === 0) { return {} }
  const keyValue = arrayOfObjects.reduce((acc, obj) => {
    acc[obj.name] = obj.value
    return acc
  }, {})
  debugMessage('Key-Values', req.log, { deployParameters: keyValue })
  return keyValue
}

// get the env vars and translate them for handlebar
function extractEnvVars(service, req) {
  const { environment: envValuesForTemplate } = service
  debugMessage('Environments', req.log, { envParameters: envValuesForTemplate })
  return envValuesForTemplate
}

function debugMessage(debugTitle, logger, messageToTrace) {
  if (process.env.NODE_ENV !== 'test') {
    logger.debug('----------------- %s ------------- \n %j \n  --------------------', debugTitle, messageToTrace)
  }
}

module.exports = {
  handler,
}

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    handler,
    extractServiceParametersFromAnnotations,
    extractServiceParametersFromLabels,
  }
}
