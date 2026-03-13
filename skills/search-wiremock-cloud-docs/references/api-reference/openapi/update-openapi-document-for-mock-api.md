> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update OpenAPI document for mock API



## OpenAPI

````yaml api-reference/openapi.yaml put /v1/mock-apis/{mockApiId}/open-api
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
  /v1/mock-apis/{mockApiId}/open-api:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    put:
      tags:
        - OpenAPI
      summary: Update OpenAPI document for mock API
      operationId: putOpenAPIDocumentForMockApi
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OpenApi'
            examples:
              main:
                value:
                  openApi:
                    doc: |-
                      openapi: 3.1.0
                      info:
                        title: Customer
                      Contacts
                      Management
                      API
                      \nn
                      description: API
                      for
                      managing
                      customer
                      contacts
                      including
                      personal
                      and
                      professional
                      \nn
                      details
                      \nn
                      version: 1.0.0
                      \nnservers:
                      \nn-
                      url: https
                      ://dev-openapi-testing.wiremockapi.cloud
        required: true
      responses:
        '204':
          description: Successfully updated
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
    OpenApi:
      required:
        - openApi
      type: object
      properties:
        openApi:
          required:
            - doc
          type: object
          properties:
            doc:
              type: string
              example: ''
      openapi: 3.1.0
      info:
        title: Customer Contacts Management API
        description: >-
          API for managing customer contacts including personal and professional
          details
        version: 1.0.0
      servers:
        - url: https://dev-openapi-testing.wiremockapi.cloud
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
