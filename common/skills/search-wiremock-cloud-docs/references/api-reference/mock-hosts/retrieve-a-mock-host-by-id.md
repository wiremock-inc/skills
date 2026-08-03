> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve a mock host by ID



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/hosts/{mockHostId}
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
  /v1/hosts/{mockHostId}:
    parameters:
      - in: path
        name: mockHostId
        description: The ID of the mock host
        required: true
        schema:
          type: string
    get:
      tags:
        - Mock Hosts
      summary: Retrieve a mock host by ID
      operationId: getMockHostById
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                required:
                  - mockHost
                properties:
                  mockHost:
                    $ref: '#/components/schemas/MockHostData'
components:
  schemas:
    MockHostData:
      type: object
      required:
        - id
        - name
        - links
      properties:
        id:
          description: The ID of the mock host.
          type: string
        name:
          description: A human-readable name for the mock host.
          type: string
          nullable: true
        friendlyHostname:
          description: A domain that addresses the mock host.
          type: string
        links:
          type: object
          properties:
            self:
              type: string
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
