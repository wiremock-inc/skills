> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get request by ID



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/requests/{requestId}
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
  /v1/mock-apis/{mockApiId}/requests/{requestId}:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Requests
      summary: Get request by ID
      operationId: getRequestById
      parameters:
        - description: The UUID of the logged request
          in: path
          name: requestId
          required: true
          example: 12fb14bb-600e-4bfa-bd8d-be7f12562c99
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              example:
                id: 12fb14bb-600e-4bfa-bd8d-be7f12562c99
                request:
                  url: /received-request/2
                  absoluteUrl: http://localhost:56738/received-request/2
                  method: GET
                  clientIp: 127.0.0.1
                  headers:
                    Connection: keep-alive
                    Host: localhost:56738
                    User-Agent: Apache-HttpClient/4.5.1 (Java/1.7.0_51)
                  cookies: {}
                  browserProxyRequest: false
                  loggedDate: 1471442557047
                  bodyAsBase64: ''
                  body: ''
                  loggedDateString: '2016-08-17T14:02:37Z'
                responseDefinition:
                  status: 404
                  transformers: []
                  fromConfiguredStub: false
                  transformerParameters: {}
        '404':
          description: Request not found
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
