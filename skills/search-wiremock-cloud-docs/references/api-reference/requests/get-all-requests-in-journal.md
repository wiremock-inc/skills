> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get all requests in journal



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/requests
openapi: 3.1.0
info:
  title: WireMock Cloud
  description: The public API for WireMock Cloud
  contact:
    email: help@wiremock.io
  version: 1.0.0
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://wmc.wiremockapi.cloud
    description: Mock
  - url: https://api.wiremock.cloud
    description: Production
security:
  - tokenAuth: []
tags:
  - name: Users
    description: User accounts
  - name: Teams
    description: Teams
  - name: Organisations
    description: Organisations
  - name: Usage
    description: Product usage
  - name: Mock APIs
    description: Mock APIs
  - name: Mock API versioning
    description: Mock API versioning
  - name: Data sources
    description: Data sources
  - name: Database connections
    description: Database connections
  - name: Security
    description: Security
  - name: Access control
    description: Access control / authorisation
  - name: API templates
    description: API template library
  - name: Jobs
    description: Background jobs e.g. OpenAPI import
  - name: OpenAPI
    description: OpenAPI description
  - name: Settings
    description: Mock API configuration settings
  - name: Stub Mappings
    description: Operations on stub mappings
    externalDocs:
      description: User documentation
      url: https://wiremock.org/docs/stubbing/
  - name: Requests
    description: Logged requests and responses received by the mock service
    externalDocs:
      description: User documentation
      url: https://wiremock.org/docs/verifying/
  - name: Recordings
    description: Stub mapping record and snapshot functions
    externalDocs:
      description: User documentation
      url: https://wiremock.org/docs/record-playback/
  - name: State
    description: Scenarios support modelling of stateful behaviour
    externalDocs:
      description: User documentation
      url: https://wiremock.org/docs/stateful-behaviour/
  - name: Imports
    description: Importing into your mock API
  - name: Mock Hosts
    description: Mock API hosts
paths:
  /v1/mock-apis/{mockApiId}/requests:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Requests
      summary: Get all requests in journal
      operationId: getAllRequestsInJournal
      parameters:
        - description: The maximum number of results to return
          in: query
          name: limit
          example: '10'
          schema:
            type: string
        - description: Only return logged requests after this date
          in: query
          name: since
          example: '2016-10-05T12:33:01Z'
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              example:
                requests:
                  - id: 45760a03-eebb-4387-ad0d-bb89b5d3d662
                    request:
                      url: /received-request/9
                      absoluteUrl: http://localhost:56715/received-request/9
                      method: GET
                      clientIp: 127.0.0.1
                      headers:
                        Connection: keep-alive
                        Host: localhost:56715
                        User-Agent: Apache-HttpClient/4.5.1 (Java/1.7.0_51)
                      cookies: {}
                      browserProxyRequest: false
                      loggedDate: 1471442494809
                      bodyAsBase64: ''
                      body: ''
                      loggedDateString: '2016-08-17T14:01:34Z'
                    responseDefinition:
                      status: 404
                      transformers: []
                      fromConfiguredStub: false
                      transformerParameters: {}
                  - id: 6ae78311-0178-46c9-987a-fbfc528d54d8
                    request:
                      url: /received-request/8
                      absoluteUrl: http://localhost:56715/received-request/8
                      method: GET
                      clientIp: 127.0.0.1
                      headers:
                        Connection: keep-alive
                        Host: localhost:56715
                        User-Agent: Apache-HttpClient/4.5.1 (Java/1.7.0_51)
                      cookies: {}
                      browserProxyRequest: false
                      loggedDate: 1471442494802
                      bodyAsBase64: ''
                      body: ''
                      loggedDateString: '2016-08-17T14:01:34Z'
                    responseDefinition:
                      status: 404
                      transformers: []
                      fromConfiguredStub: false
                      transformerParameters: {}
                  - id: aba8e4ad-1b5b-4518-8f05-b2170a24de35
                    request:
                      url: /received-request/7
                      absoluteUrl: http://localhost:56715/received-request/7
                      method: GET
                      clientIp: 127.0.0.1
                      headers:
                        Connection: keep-alive
                        Host: localhost:56715
                        User-Agent: Apache-HttpClient/4.5.1 (Java/1.7.0_51)
                      cookies: {}
                      browserProxyRequest: false
                      loggedDate: 1471442494795
                      bodyAsBase64: ''
                      body: ''
                      loggedDateString: '2016-08-17T14:01:34Z'
                    responseDefinition:
                      status: 404
                      transformers: []
                      fromConfiguredStub: false
                      transformerParameters: {}
                meta:
                  total: 9
                requestJournalDisabled: false
          description: List of received requests
components:
  parameters:
    mockApiId:
      in: path
      name: mockApiId
      description: The ID of the Mock API
      required: true
      schema:
        $ref: '#/components/schemas/IdSchema'
  schemas:
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
