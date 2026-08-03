> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a mock API's versions



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/version-history/commits
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
  /v1/mock-apis/{mockApiId}/version-history/commits:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
      - $ref: '#/components/parameters/Limit'
      - $ref: '#/components/parameters/Page'
    get:
      tags:
        - Mock API versioning
      summary: Get a mock API's versions
      operationId: getMockApiVersionHistoryCommits
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VersionHistoryCommits'
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
    Limit:
      name: limit
      in: query
      required: false
      schema:
        type: integer
        minimum: 1
      example: 10
    Page:
      name: page
      in: query
      required: false
      schema:
        type: integer
        minimum: 1
      example: 3
  schemas:
    VersionHistoryCommits:
      type: object
      properties:
        versionCommits:
          type: array
          items:
            $ref: '#/components/schemas/VersionHistoryCommitData'
        meta:
          $ref: '#/components/schemas/PaginationMeta'
        links:
          $ref: '#/components/schemas/PaginationLinks'
      required:
        - versionCommits
        - meta
        - links
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    VersionHistoryCommitData:
      type: object
      properties:
        id:
          description: The ID of the version.
          type: string
        date:
          description: The date-time that the version was created.
          type: string
        author:
          type: object
          nullable: true
          properties:
            id:
              description: The ID of the user that created this version.
              type: string
            username:
              description: The username of the user that created this version.
              type: string
          required:
            - id
            - username
        links:
          type: object
          properties:
            self:
              type: string
            items:
              type: string
            restore:
              type: string
            changes:
              type: string
          required:
            - self
            - items
            - restore
            - changes
      required:
        - id
        - date
        - author
    PaginationMeta:
      type: object
      properties:
        start:
          type: integer
          minimum: 1
          description: The starting index of the current page
          example: 20
        end:
          type: integer
          minimum: 1
          description: The ending index of the current page
          example: 29
        total:
          type: integer
          minimum: 1
          description: The total number of items available
          example: 48
        page:
          type: integer
          minimum: 1
          description: The current page number
          example: 3
        totalPages:
          type: integer
          minimum: 1
          description: The total number of pages available
          example: 5
      required:
        - start
        - end
        - total
        - page
        - totalPages
    PaginationLinks:
      type: object
      properties:
        self:
          type: string
          description: URL path to the user's APIs with optional query parameters
          example: /v1/users/abc12/apis?q=training&limit=20&page=1
      additionalProperties:
        type: string
        description: URL path for any other link type
      required:
        - self
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
