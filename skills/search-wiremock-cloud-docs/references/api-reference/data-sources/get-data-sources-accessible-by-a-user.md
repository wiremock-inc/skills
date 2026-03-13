> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get data sources accessible by a user



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/users/{userId}/data-sources
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
    get:
      tags:
        - Data sources
      summary: Get data sources accessible by a user
      operationId: getDataSourcesForUser
      parameters:
        - schema:
            type: integer
          in: query
          name: limit
          description: The amount of page items to retrieve.
          required: false
        - schema:
            type: integer
          in: query
          name: page
          description: The index of the page to retrieve.
          required: false
        - in: query
          name: q
          description: >-
            A filter for the retrieved items. Only items whose name contains the
            filter value will be retrieved. The filter is case insensitive.
          required: false
          schema:
            type: string
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DataSources'
              examples:
                dataSources:
                  value:
                    dataSources:
                      - id: abc123
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
                      - id: def543
                        aclObject: lkj987
                        name: My database data source
                        lastUpdatedTime: '2024-01-17T11:46:13.481826Z'
                        version: 3
                        type: DATABASE
                        databaseConnection: zyx321
                        tableName: products
                        state: ENABLED
                        links:
                          self: /v1/data-sources/def543
                          acl: /v1/data-sources/def543/acl{?subjectId}
                    links:
                      self: /v1/users/my-user/data-sources?page=2&limit=20
                      next: /v1/users/my-user/data-sources?page=3&limit=20
                      previous: /v1/users/my-user/data-sources?page=1&limit=20
                    meta:
                      start: 21
                      end: 40
                      total: 123
                      page: 2
                      totalPages: 7
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '500':
          $ref: '#/components/responses/500'
components:
  schemas:
    DataSources:
      allOf:
        - type: object
          properties:
            dataSources:
              type: array
              items:
                $ref: '#/components/schemas/DataSourceResponse'
          required:
            - dataSources
        - $ref: '#/components/schemas/PaginationData'
    DataSourceResponse:
      allOf:
        - $ref: '#/components/schemas/DataSourceResponseBase'
        - oneOf:
            - $ref: '#/components/schemas/DataSourceResponseCsvBase'
              title: CSV
            - $ref: '#/components/schemas/DataSourceResponseDatabaseBase'
              title: Database
    PaginationData:
      type: object
      properties:
        links:
          type: object
          properties:
            self:
              type: string
            next:
              type: string
            previous:
              type: string
          required:
            - self
        meta:
          type: object
          properties:
            start:
              type: number
            end:
              type: number
            total:
              type: number
            page:
              type: number
            totalPages:
              type: number
          required:
            - start
            - end
            - total
            - page
            - totalPages
      required:
        - links
        - meta
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    ServerError:
      type: object
      properties:
        code:
          type: number
        message:
          type: string
      required:
        - code
        - message
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
    '500':
      description: 500 Server Error response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ServerError'
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
