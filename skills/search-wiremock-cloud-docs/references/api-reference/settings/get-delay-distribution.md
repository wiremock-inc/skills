> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get delay distribution



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/settings/delayDistribution
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
  /v1/mock-apis/{mockApiId}/settings/delayDistribution:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Settings
      summary: Get delay distribution
      operationId: getDelayDistribution
      responses:
        '200':
          description: The delay distribution settings
          content:
            application/json:
              schema:
                type: object
                properties:
                  delayDistribution:
                    $ref: '#/components/schemas/delay-distribution'
              examples:
                uniform:
                  summary: Uniform distribution
                  value:
                    delayDistribution:
                      type: uniform
                      lower: 5
                      upper: 9
                lognormal:
                  summary: Log normal distribution
                  value:
                    delayDistribution:
                      type: lognormal
                      median: 100
                      sigma: 0.5
                fixed:
                  summary: Fixed delay
                  value:
                    delayDistribution:
                      type: fixed
                      milliseconds: 500
                none:
                  summary: No delay distribution
                  value:
                    delayDistribution:
                      type: none
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
    delay-distribution:
      type: object
      description: >-
        The delay distribution. Determines how response delays are distributed
        across requests.
      oneOf:
        - title: Log normal
          description: Log normally distributed random response delay.
          type: object
          properties:
            median:
              type: number
              description: 50th percentile of the distribution in milliseconds.
            sigma:
              type: number
              description: >-
                Standard deviation of the underlying normal distribution. A
                larger value produces a longer tail.
            maxValue:
              type: number
              description: >-
                Maximum value in milliseconds to truncate the distribution at.
                Must be greater than or equal to median. Omit to disable
                truncation.
            type:
              type: string
              enum:
                - lognormal
          required:
            - median
            - sigma
        - title: Uniform
          description: Uniformly distributed random response delay.
          type: object
          properties:
            lower:
              type: integer
              description: Lower bound of the delay range in milliseconds (inclusive).
            upper:
              type: integer
              description: Upper bound of the delay range in milliseconds (inclusive).
            type:
              type: string
              enum:
                - uniform
          required:
            - lower
            - upper
        - title: Fixed
          description: Fixed response delay.
          type: object
          properties:
            milliseconds:
              type: integer
              description: Fixed delay duration in milliseconds.
            type:
              type: string
              enum:
                - fixed
          required:
            - milliseconds
        - title: None
          description: >-
            No delay distribution. Clears any previously configured
            distribution.
          type: object
          properties:
            type:
              type: string
              enum:
                - none
          required:
            - type
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
