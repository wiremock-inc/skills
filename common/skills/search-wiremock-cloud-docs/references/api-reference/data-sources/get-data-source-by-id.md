> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get data source by ID



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/data-sources/{dataSourceId}
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
  /v1/data-sources/{dataSourceId}:
    parameters:
      - in: path
        name: dataSourceId
        required: true
        schema:
          type: string
    get:
      tags:
        - Data sources
      summary: Get data source by ID
      operationId: getDataSourceById
      parameters:
        - in: query
          name: data-view
          description: >
            Optionally request a view of the data source's row data. If omitted,
            no rows will be returned in the response.
             * `preview` - Returns the first few rows of data contained in the data source.
             * `none` - Returns no rows.
          schema:
            type: string
            enum:
              - none
              - preview
            default: none
          required: false
      responses:
        '200':
          $ref: '#/components/responses/GetDataSourceResponse'
        '403':
          description: 403 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Errors'
        '404':
          description: 404 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Errors'
components:
  responses:
    GetDataSourceResponse:
      description: Success
      content:
        application/json:
          schema:
            type: object
            properties:
              dataSource:
                $ref: '#/components/schemas/GetDataSourceResponse'
            required:
              - dataSource
          examples:
            csvDataSourceNoRows:
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
            csvDataSourcePreviewRows:
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
                  rowsPreview:
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
                  state: ENABLED
                  links:
                    self: /v1/data-sources/abc123
                    acl: /v1/data-sources/abc123/acl{?subjectId}
            databaseDataSourceNoRows:
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
            databaseDataSourcePreviewRows:
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
                  columnsMetadata:
                    - name: fullname
                    - name: dob
                    - name: admin
                    - name: retryLimit
                  rowsPreview:
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
                  state: ENABLED
                  links:
                    self: /v1/data-sources/abc123
                    acl: /v1/data-sources/abc123/acl{?subjectId}
  schemas:
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    GetDataSourceResponse:
      allOf:
        - $ref: '#/components/schemas/DataSourceResponseBase'
        - oneOf:
            - title: CSV
              allOf:
                - $ref: '#/components/schemas/DataSourceResponseCsvBase'
                - type: object
                  properties:
                    rowsPreview:
                      description: >-
                        A preview of the data contained in the data source.
                        Present if and only if `data-view` query parameter is
                        set to `preview`.
                      type: array
                      nullable: false
                      items:
                        type: array
                        items:
                          type: string
            - title: Database
              allOf:
                - $ref: '#/components/schemas/DataSourceResponseDatabaseBase'
                - type: object
                  properties:
                    columnsMetadata:
                      description: >-
                        An ordered list of the names of each column of the data
                        contained in the data source. Present if and only if
                        `data-view` query parameter is set to `preview`.
                      type: array
                      nullable: false
                      items:
                        type: object
                        nullable: false
                        properties:
                          name:
                            description: The name of the column.
                            type: string
                            nullable: false
                    rowsPreview:
                      description: >-
                        A preview of the data contained in the data source.
                        Present if and only if `data-view` query parameter is
                        set to `preview`.
                      type: array
                      nullable: false
                      items:
                        type: array
                        items:
                          type: string
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
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
