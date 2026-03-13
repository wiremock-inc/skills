> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update chaos settings



## OpenAPI

````yaml api-reference/openapi.yaml put /v1/mock-apis/{mockApiId}/settings/chaos
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
  /v1/mock-apis/{mockApiId}/settings/chaos:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    put:
      tags:
        - Settings
      summary: Update chaos settings
      operationId: updateChaosSettings
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - chaos
              properties:
                chaos:
                  $ref: '#/components/schemas/ChaosSettings'
            example:
              chaos:
                enabled: true
                percentageFailures: 13
                socketClose:
                  enabled: true
                socketReset:
                  enabled: true
                invalidHttp:
                  enabled: false
                longDelay:
                  enabled: true
                  durationMillis: 555
                httpErrors:
                  - status: 503
      responses:
        '200':
          description: Settings successfully updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  chaos:
                    $ref: '#/components/schemas/ChaosSettings'
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
    ChaosSettings:
      type: object
      description: >-
        Chaos testing settings for introducing random failures into mock API
        responses.
      properties:
        enabled:
          type: boolean
          description: Master switch to enable or disable chaos testing.
        percentageFailures:
          type: number
          format: double
          description: Percentage of requests that should receive a failure response.
          minimum: 0
          maximum: 100
        socketClose:
          type: object
          description: Randomly close the socket without sending a response.
          properties:
            enabled:
              type: boolean
        socketReset:
          type: object
          description: Randomly reset the socket connection.
          properties:
            enabled:
              type: boolean
        invalidHttp:
          type: object
          description: Randomly return an invalid HTTP response.
          properties:
            enabled:
              type: boolean
        longDelay:
          type: object
          description: Randomly introduce a long delay before responding.
          properties:
            enabled:
              type: boolean
            durationMillis:
              type: integer
              description: Duration of the delay in milliseconds.
        httpErrors:
          type: array
          description: HTTP error status codes to randomly return.
          items:
            type: object
            properties:
              status:
                type: integer
                description: HTTP status code (400-599).
                minimum: 400
                maximum: 599
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
