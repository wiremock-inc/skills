> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Test a database connection



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/users/{userId}/database-connections/test
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
  /v1/users/{userId}/database-connections/test:
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    post:
      tags:
        - Database connections
      summary: Test a database connection
      operationId: testDatabaseConnection
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DatabaseConnectionCoords'
            examples:
              databaseConnection:
                value:
                  databaseType: POSTGRESQL
                  host: my-db.example.com
                  port: 5432
                  databaseName: my-test-data
                  username: alice
                  password: mysecretpassword
      responses:
        '200':
          $ref: '#/components/responses/TestDatabaseConnectionResponse'
        '400':
          $ref: '#/components/responses/400'
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
components:
  schemas:
    DatabaseConnectionCoords:
      allOf:
        - $ref: '#/components/schemas/DatabaseConnectionCoordsBase'
        - type: object
          properties:
            password:
              description: The password of the user to connect to the database as.
              type: string
              nullable: false
          required:
            - password
    DatabaseConnectionCoordsBase:
      type: object
      nullable: false
      properties:
        databaseType:
          description: The SQL flavour of the database.
          type: string
          enum:
            - POSTGRESQL
            - MYSQL
            - SQLSERVER
            - ORACLE
        host:
          description: The host name or address of the database.
          type: string
          nullable: false
        port:
          description: The port number of the database.
          type: integer
          nullable: false
        databaseName:
          description: The name of the database.
          type: string
          nullable: false
        username:
          description: The name of the user to connect to the database as.
          type: string
          nullable: false
      required:
        - databaseType
        - host
        - port
        - databaseName
        - username
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
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
  responses:
    '400':
      description: 400 Bad Request response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Errors'
          example:
            errors:
              - title: Invalid query parameter format
                detail: The offset parameter value must be a positive integer
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
    TestDatabaseConnectionResponse:
      description: Success
      content:
        application/json:
          schema:
            allOf:
              - type: object
                properties:
                  outcome:
                    type: string
                    nullable: false
                    enum:
                      - SUCCESS
                      - FAILURE
                required:
                  - outcome
              - type: object
                properties:
                  errors:
                    type: array
                    nullable: false
                    items:
                      $ref: '#/components/schemas/SingleError'
          examples:
            successOutcome:
              value:
                outcome: SUCCESS
            failureOutcome:
              value:
                outcome: FAILURE
                errors:
                  - title: Could not connect to database.
                    detail: Password authentication attempt was rejected.
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
