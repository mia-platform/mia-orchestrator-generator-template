/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
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

process.env.NODE_ENV = 'test'
const generatorModule = require('./generate')

describe('Extract service parameters from labels', () => {
  test('Read a label array of objects and returns key-value {test: \'myValue\',}', () => {
    const inputMock = {
      services: {
        'function': {
          name: 'function-name',
        },
      },
      labels: [
        {
          name: 'test',
          value: 'myValue',
          description: 'description',
        },
      ],
    }

    const expectResult = {
      test: 'myValue',
    }

    const result = generatorModule.extractServiceParametersFromLabels(inputMock, {})
    expect(result).toEqual(expectResult)
  })

  test('Read structure with a missing label array, return an empty object {}', () => {
    const inputMock = {
      services: {
        'function': {
          name: 'function-name',
        },
      },
    }

    const expectResult = {}

    const result = generatorModule.extractServiceParametersFromLabels(inputMock, {})
    expect(result).toEqual(expectResult)
  })
})
