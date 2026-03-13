> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get all teams in an organisation



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/organisations/{organisationId}/teams
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
  /v1/organisations/{organisationId}/teams:
    parameters:
      - in: path
        name: organisationId
        required: true
        schema:
          type: string
      - in: query
        name: q
        description: >-
          A filter for the retrieved items. Only items whose name contains the
          filter value will be retrieved. The filter is case insensitive.
        required: false
        schema:
          type: string
      - $ref: '#/components/parameters/Limit'
      - $ref: '#/components/parameters/Page'
    get:
      tags:
        - Teams
      summary: Get all teams in an organisation
      operationId: getOrganisationTeams
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Teams'
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
                      self: /v1/organisations/mgk7g/teams?limit=20&page=1
                    teams:
                      - id: p9e4r
                        aclSubject: dyv8j
                        aclObject: 626vg
                        name: Elite Team
                        links:
                          organisation: /v1/organisations/mgk7g
                          aclSubject: /v1/acl/subjects/dyv8j
                          aclObject: /v1/acl/objects/626vg
                          acl: /v1/teams/p9e4r/acl{?subjectId}
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
components:
  parameters:
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
    Teams:
      type: object
      properties:
        teams:
          type: array
          items:
            $ref: '#/components/schemas/TeamData'
        meta:
          $ref: '#/components/schemas/PaginationMeta'
        links:
          $ref: '#/components/schemas/PaginationLinks'
    TeamData:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        aclObject:
          description: The ACL object ID of the entity.
          type: string
        aclSubject:
          description: The ACL subject ID of the entity.
          type: string
        links:
          type: object
          properties:
            organisation:
              type: string
            aclSubject:
              type: string
            aclObject:
              type: string
            acl:
              type: string
      required:
        - id
        - name
        - links
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
