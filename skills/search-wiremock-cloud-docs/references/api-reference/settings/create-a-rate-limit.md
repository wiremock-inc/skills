> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a rate limit



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/mock-apis/{mockApiId}/settings/rateLimits
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
  /v1/mock-apis/{mockApiId}/settings/rateLimits:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    post:
      tags:
        - Settings
      summary: Create a rate limit
      operationId: createRateLimit
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - rateLimit
              properties:
                rateLimit:
                  $ref: '#/components/schemas/RateLimitWithId'
            example:
              rateLimit:
                id: main
                rate: 10
                unit: seconds
                burst: 50
      responses:
        '201':
          description: Rate limit created
          content:
            application/json:
              schema:
                type: object
                properties:
                  rateLimit:
                    $ref: '#/components/schemas/RateLimitWithId'
                  links:
                    type: object
                    properties:
                      self:
                        type: string
              example:
                rateLimit:
                  id: main
                  rate: 10
                  unit: seconds
                  burst: 50
                links:
                  self: /v1/mock-apis/abc123/settings/rateLimits/main
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '422':
          $ref: '#/components/responses/422'
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
    RateLimitWithId:
      type: object
      description: A rate limit configuration with its identifier.
      required:
        - id
        - rate
        - unit
      properties:
        id:
          type: string
          description: Unique identifier for this rate limit.
        rate:
          type: integer
          description: Number of requests allowed per time unit.
        unit:
          type: string
          description: Time unit for the rate limit.
          enum:
            - seconds
            - minutes
            - hours
            - days
        burst:
          type: integer
          description: Maximum burst capacity. Defaults to the rate value if not specified.
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
    '422':
      description: 422 Bad Entity response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Errors'
          example:
            errors:
              - title: Invalid JSON
                detail: >-
                  json pointer /mockApi not present; it is required and must
                  have json type object
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
