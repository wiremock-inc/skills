> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get usage

> Get product usage for the current billing period for a subscription



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/subscriptions/{subscriptionId}/usage
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
  /v1/subscriptions/{subscriptionId}/usage:
    parameters:
      - in: path
        name: subscriptionId
        required: true
        schema:
          type: string
    get:
      tags:
        - Usage
      summary: Get usage
      description: Get product usage for the current billing period for a subscription
      operationId: getUsage
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Usage'
              examples:
                main:
                  value:
                    usage:
                      id: kl1g9
                      currentPeriodStart: '2024-08-01T13:50:48.988681Z'
                      currentPeriodEnd: '2025-08-01T13:50:48.988681Z'
                      stubCalledCount: 22309
                      exportCalledCount: 30
                      organisationMemberCount: 15
                      invitationCount: 0
                      seatLimit: null
                      totalMockApiCount: 158
                      totalDataSourceCount: 9
                      totalDatabaseConnectionCount: 2
                      ownMockApiCount: 0
                      teamMockApiCount: 0
                      collaboratorCount: 0
                      totalSeatCount: 15
                      teamMemberCount: 15
                      totalTeamCount: 15
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
components:
  schemas:
    Usage:
      type: object
      properties:
        usage:
          type: object
          properties:
            id:
              type: string
            currentPeriodStart:
              type: string
            currentPeriodEnd:
              type: string
            stubCalledCount:
              type: number
            organisationMemberCount:
              type: number
            invitationCount:
              type: number
            seatLimit:
              type:
                - number
                - 'null'
            totalMockApiCount:
              type: number
            totalDataSourceCount:
              type: number
            totalDatabaseConnectionCount:
              type: number
            ownMockApiCount:
              type: number
            teamMockApiCount:
              type: number
            collaboratorCount:
              type: number
            totalSeatCount:
              type: number
            teamMemberCount:
              type: number
            totalTeamCount:
              type: number
          required:
            - id
            - currentPeriodStart
            - currentPeriodEnd
            - stubCalledCount
            - organisationMemberCount
            - invitationCount
            - seatLimit
            - totalMockApiCount
            - totalDataSourceCount
            - totalDatabaseConnectionCount
            - ownMockApiCount
            - teamMockApiCount
            - collaboratorCount
            - totalSeatCount
            - teamMemberCount
            - totalTeamCount
      required:
        - usage
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
    '404':
      description: 404 Not Found response
      content:
        application/json:
          schema:
            type: object
            properties:
              code:
                type: integer
              message:
                type: string
            required:
              - message
          example:
            code: 404
            message: HTTP 404 Not Found
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
