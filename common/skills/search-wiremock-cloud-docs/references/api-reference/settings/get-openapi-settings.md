> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get OpenAPI settings



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/settings/openapi
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
  /v1/mock-apis/{mockApiId}/settings/openapi:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Settings
      summary: Get OpenAPI settings
      operationId: getOpenApiSettings
      responses:
        '200':
          description: The OpenAPI settings
          content:
            application/json:
              schema:
                type: object
                properties:
                  openapi:
                    $ref: '#/components/schemas/OpenApiSettings'
              example:
                openapi:
                  portalEnabled: true
                  portalSecurity:
                    type: OIDC
                  validationMode: soft
                  generateOpenApiFromStubs: true
                  generateStubsFromOpenApi: true
                  generateDefaultStubs: false
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
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
    OpenApiSettings:
      type: object
      description: OpenAPI integration settings for the mock API.
      properties:
        portalEnabled:
          type: boolean
          description: Enable or disable the OpenAPI Developer Portal.
        portalSecurity:
          type: object
          description: Security configuration for the Developer Portal.
          required:
            - type
          properties:
            type:
              type: string
              description: The type of security to apply to the Developer Portal.
              enum:
                - NONE
                - OIDC
        validationMode:
          type: string
          description: OpenAPI request/response validation mode.
          enum:
            - none
            - soft
            - hard
        generateOpenApiFromStubs:
          type: boolean
          description: Automatically generate an OpenAPI description from stub mappings.
        generateStubsFromOpenApi:
          type: boolean
          description: Automatically generate stub mappings from the OpenAPI description.
        generateDefaultStubs:
          type: boolean
          description: Generate default/generic stubs from the OpenAPI description.
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    SingleError:
      type: object
      properties:
        code:
          type: number
        title:
          type: string
        detail:
          type: string
        source:
          type: object
      required:
        - title
  responses:
    '401':
      description: 401 Unauthenticated response
      content:
        text/plain:
          schema:
            type: string
          example: Credentials are required to access this resource.
    '403':
      description: 403 Unauthorized response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Errors'
          example:
            errors:
              - title: Forbidden
                source: {}
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
