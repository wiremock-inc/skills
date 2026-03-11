> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a data source



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/users/{userId}/data-sources
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
  /v1/users/{userId}/data-sources:
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    post:
      tags:
        - Data sources
      summary: Create a data source
      operationId: createDataSource
      requestBody:
        $ref: '#/components/requestBodies/CreateDataSourceRequestBody'
      responses:
        '201':
          $ref: '#/components/responses/CreateDataSourceResponse'
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
    CreateDataSourceRequestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            nullable: false
            properties:
              dataSource:
                allOf:
                  - type: object
                    nullable: false
                    properties:
                      name:
                        description: The name of the data source, for display purposes.
                        type: string
                        nullable: false
                      type:
                        description: >-
                          The type of the data source. The type of a data source
                          dictates where the data source's data comes from.
                        type: string
                        nullable: false
                        enum:
                          - CSV
                          - DATABASE
                        default: CSV
                    required:
                      - name
                  - oneOf:
                      - title: CSV
                        type: object
                        properties:
                          type:
                            enum:
                              - CSV
                          columnsMetadata:
                            description: >-
                              A description of the format of each column of the
                              data source's data.
                            type: array
                            nullable: false
                            items:
                              $ref: '#/components/schemas/DataSourceColumnMetadata'
                          rows:
                            description: >-
                              The data source's data. Each item in the outer
                              array represents a row, while each item in each
                              inner array represents a cell in that row.
                            type: array
                            nullable: false
                            items:
                              type: array
                              nullable: false
                              items:
                                type: string
                        required:
                          - columnsMetadata
                          - rows
                      - title: Database
                        type: object
                        properties:
                          type:
                            enum:
                              - DATABASE
                          databaseConnection:
                            description: >-
                              The ID of the database connection this data source
                              retrieves its data from.
                            type: string
                            nullable: false
                          tableName:
                            description: >-
                              The name of the table or view in the database that
                              this data source retrieves its data from.
                            type: string
                            nullable: false
                        required:
                          - type
                          - databaseConnection
                          - tableName
            required:
              - dataSource
          examples:
            csvDataSource:
              value:
                dataSource:
                  name: My data source
                  type: CSV
                  columnsMetadata:
                    - name: fullname
                      type:
                        name: STRING
                    - name: dob
                      type:
                        name: DATE
                        format: iso8601
                    - name: admin
                      type:
                        name: BOOLEAN
                    - name: retryLimit
                      type:
                        name: INTEGER
                  rows:
                    - - Alice S
                      - '1975-05-31'
                      - 'true'
                      - '3'
                    - - Bob B
                      - '1959-11-16'
                      - 'false'
                      - '1'
                    - - Sam M
                      - '1999-07-02'
                      - 'false'
                      - '0'
            databaseDataSource:
              value:
                dataSource:
                  name: My database data source
                  type: DATABASE
                  databaseConnection: zyx321
                  tableName: products
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
    CreateDataSourceResponse:
      description: Success
      content:
        application/json:
          schema:
            type: object
            properties:
              dataSource:
                $ref: '#/components/schemas/DataSourceResponse'
            required:
              - dataSource
          examples:
            csvDataSource:
              value:
                dataSource:
                  id: abc123
                  aclObject: jkl789
                  name: My data source
                  lastUpdatedTime: '2024-01-17T11:46:13.481826Z'
                  version: 3
                  type: CSV
                  columnsMetadata:
                    - name: fullname
                      type:
                        name: STRING
                    - name: dob
                      type:
                        name: DATE
                        format: iso8601
                    - name: admin
                      type:
                        name: BOOLEAN
                    - name: retryLimit
                      type:
                        name: INTEGER
                  state: ENABLED
                  links:
                    self: /v1/data-sources/abc123
                    acl: /v1/data-sources/abc123/acl{?subjectId}
            databaseDataSource:
              value:
                dataSource:
                  id: abc123
                  aclObject: jkl789
                  name: My database data source
                  lastUpdatedTime: '2024-01-17T11:46:13.481826Z'
                  version: 3
                  type: DATABASE
                  databaseConnection: zyx321
                  tableName: products
                  state: ENABLED
                  links:
                    self: /v1/data-sources/abc123
                    acl: /v1/data-sources/abc123/acl{?subjectId}
  schemas:
    DataSourceColumnMetadata:
      type: object
      properties:
        name:
          type: string
        type:
          type: object
          properties:
            name:
              type: string
      required:
        - name
        - type
    DataSourceResponse:
      allOf:
        - $ref: '#/components/schemas/DataSourceResponseBase'
        - oneOf:
            - $ref: '#/components/schemas/DataSourceResponseCsvBase'
              title: CSV
            - $ref: '#/components/schemas/DataSourceResponseDatabaseBase'
              title: Database
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    DataSourceResponseBase:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        aclObject:
          description: The ACL object ID of the entity.
          type: string
        lastUpdatedTime:
          type: string
        version:
          type: number
        type:
          type: string
          enum:
            - CSV
            - DATABASE
        state:
          type: string
          enum:
            - ENABLED
            - DISABLED
        links:
          type: object
          properties:
            self:
              type: string
            acl:
              type: string
          required:
            - self
            - acl
      required:
        - id
        - name
        - lastUpdatedTime
        - version
        - type
        - state
        - links
    DataSourceResponseCsvBase:
      type: object
      properties:
        type:
          enum:
            - CSV
        columnsMetadata:
          type: array
          items:
            $ref: '#/components/schemas/DataSourceColumnMetadata'
      required:
        - columnsMetadata
    DataSourceResponseDatabaseBase:
      type: object
      properties:
        type:
          enum:
            - DATABASE
        databaseConnection:
          type: string
        tableName:
          type: string
      required:
        - databaseConnection
        - tableName
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
