> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get users in an organisation

> Gets the users under a specific organisation, optionally filtered by username/email address.



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/organisations/{organisationId}/users
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
  /v1/organisations/{organisationId}/users:
    parameters:
      - $ref: '#/components/parameters/organisationId'
    get:
      tags:
        - Organisations
      summary: Get users in an organisation
      description: >-
        Gets the users under a specific organisation, optionally filtered by
        username/email address.
      operationId: getUserAccountsInOrganisation
      parameters:
        - in: query
          name: q
          description: >-
            The search query to filter by. Partially matched against username
            and email address.
          required: false
          schema:
            type: string
            example: docs@example.com
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Page'
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserAccounts'
              examples:
                main:
                  value:
                    meta:
                      start: 1
                      end: 1
                      total: 1
                      page: 1
                      totalPages: 1
                    links:
                      self: /v1/organisations/mgk7g/users?limit=20&page=1
                    users:
                      - id: 9gd5l
                        username: docs@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/0dc7361faa5dcde8ee7789f06074bb30?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdo.png
                        emailAddress: docs@example.com
                        links:
                          self: /v1/users/9gd5l
                          features: /v1/users/9gd5l/features
                          progress: /v1/users/9gd5l/progress
                          teams: /v1/users/9gd5l/teams
                          mockApis: /v1/users/9gd5l/apis
                          apiTemplateCatalogues: /v1/users/9gd5l/api-template-catalogues
                          apiTemplates: /v1/users/9gd5l/api-templates
                          dataSources: /v1/users/9gd5l/data-sources
                          keys: /v1/users/9gd5l/jwks
                          organisation: /v1/organisations/mgk7g
                          aclSubject: /v1/acl/subjects/9gd5l
                          aclObject: /v1/acl/objects/4kg32
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
components:
  parameters:
    organisationId:
      in: path
      name: organisationId
      description: The ID of the organisation
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
    UserAccounts:
      type: object
      properties:
        users:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              username:
                type: string
              avatarUrl:
                type: string
              emailAddress:
                type: string
              links:
                type: object
                properties:
                  self:
                    type: string
                  teams:
                    type: string
                  mockApis:
                    type: string
                  apiTemplateCatalogues:
                    type: string
                  apiTemplates:
                    type: string
                  organisation:
                    type: string
                required:
                  - self
                  - teams
                  - mockApis
                  - apiTemplateCatalogues
                  - apiTemplates
                  - organisation
            required:
              - id
              - username
              - avatarUrl
              - emailAddress
              - links
        meta:
          $ref: '#/components/schemas/PaginationMeta'
        links:
          $ref: '#/components/schemas/PaginationLinks'
      required:
        - users
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
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
