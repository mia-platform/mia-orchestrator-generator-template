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

const customService = require('@mia-platform/custom-plugin-lib')()
const generate = require('./handlers/generate')

module.exports = customService(async function index(service) {
  service.log.debug('----------------- Debug Mode Enabled---------')
  service.log.info('Welcome to\nMia-Platform AWS Orchestrator\nMade with \u2764\uFE0F  in 🇮🇹')

  service.addRawCustomPlugin('POST', '/generate', generate.handler)
})
