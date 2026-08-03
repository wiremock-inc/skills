> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a database connection



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/users/{userId}/database-connections
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
  /v1/users/{userId}/database-connections:
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    post:
      tags:
        - Database connections
      summary: Create a database connection
      operationId: createDatabaseConnection
      requestBody:
        $ref: '#/components/requestBodies/CreateDatabaseConnectionRequestBody'
      responses:
        '201':
          $ref: '#/components/responses/CreateDatabaseConnectionResponse'
        '400':
          $ref: '#/components/responses/400'
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '422':
          $ref: '#/components/responses/422'
components:
  requestBodies:
    CreateDatabaseConnectionRequestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              databaseConnection:
                allOf:
                  - $ref: '#/components/schemas/DatabaseConnectionBase'
                  - type: object
                    properties:
                      password:
                        description: >-
                          The password of the user to connect to the database
                          as.
                        type: string
                        nullable: false
                    required:
                      - password
            required:
              - databaseConnection
          examples:
            databaseConnection:
              value:
                databaseConnection:
                  connectionName: My database connection
                  databaseType: POSTGRESQL
                  host: my-db.example.com
                  port: 5432
                  databaseName: my-test-data
                  username: alice
                  password: mysecretpassword
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
    CreateDatabaseConnectionResponse:
      description: Success
      content:
        application/json:
          schema:
            type: object
            properties:
              databaseConnection:
                $ref: '#/components/schemas/DatabaseConnectionResponse'
            required:
              - databaseConnection
          examples:
            databaseConnection:
              value:
                databaseConnection:
                  id: abc123
                  connectionName: My database connection
                  databaseType: POSTGRESQL
                  host: my-db.example.com
                  port: 5432
                  databaseName: my-test-data
                  username: alice
                  links:
                    self: /v1/data-connections/abc123
  schemas:
    DatabaseConnectionBase:
      allOf:
        - type: object
          nullable: false
          properties:
            connectionName:
              description: The name of the connection, for display purposes.
              type: string
              nullable: false
          required:
            - connectionName
        - $ref: '#/components/schemas/DatabaseConnectionCoordsBase'
    DatabaseConnectionResponse:
      allOf:
        - type: object
          properties:
            id:
              description: The ID of the connection.
              type: string
              nullable: false
          required:
            - id
        - $ref: '#/components/schemas/DatabaseConnectionBase'
        - type: object
          properties:
            links:
              type: object
              nullable: false
              properties:
                self:
                  type: string
                  nullable: false
              required:
                - self
          required:
            - links
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
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
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
