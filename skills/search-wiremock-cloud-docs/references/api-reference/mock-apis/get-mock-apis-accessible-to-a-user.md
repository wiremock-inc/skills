> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get mock APIs accessible to a user



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/users/{userId}/apis
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
  /v1/users/{userId}/apis:
    parameters:
      - in: path
        name: userId
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
      - in: query
        name: sort
        description: >-
          Comma-separated list of sort fields. Prefix with `-` for descending
          order. Supported fields: `name`, `createdDate`.
        required: false
        schema:
          type: string
          default: '-createdDate'
        example: '-createdDate'
      - in: query
        name: subjectType
        description: >-
          Filter mock APIs by ACL subject type. Must be used together with
          `subjectId`.
        required: false
        schema:
          type: string
          enum:
            - team
            - user
      - in: query
        name: subjectId
        description: >-
          Filter mock APIs by ACL subject ID. Must be used together with
          `subjectType`.
        required: false
        schema:
          type: string
      - $ref: '#/components/parameters/Limit'
      - $ref: '#/components/parameters/Page'
    get:
      tags:
        - Mock APIs
      summary: Get mock APIs accessible to a user
      operationId: getMockApisForUser
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MockApis'
              examples:
                main:
                  value:
                    links:
                      self: /v1/users/9gd5l/apis?limit=20&page=1
                    meta:
                      start: 1
                      end: 1
                      total: 1
                      page: 1
                      totalPages: 1
                    mockApis:
                      - id: 63om1
                        aclObject: 1z6rd
                        name: Example Mock API
                        description: An API consisting of assorted stubs.
                        state: RUNNING
                        adminSecurityEnabled: true
                        exportState: EXPORT_ALLOWED
                        createdDate: '2024-08-23T20:15:32.432385Z'
                        openApiGitIntegration: 63om1-openapi-integration-git
                        links:
                          self: /v1/mock-apis/63om1
                          requests: /v1/mock-apis/63om1/requests
                          mappings: /v1/mock-apis/63om1/mappings
                          scenarios: /v1/mock-apis/63om1/scenarios
                          recordings:
                            start: /v1/mock-apis/63om1/recordings/start
                            stop: /v1/mock-apis/63om1/recordings/stop
                            status: /v1/mock-apis/63om1/recordings/status
                            snapshot: /v1/mock-apis/63om1/recordings/snapshot
                          imports: /v1/mock-apis/63om1/imports
                          organisation: /v1/organisations/mgk7g
                          aclObject: /v1/acl/objects/1z6rd
                          aclRoles: /v1/acl/objects/1z6rd/roles
                          invitations: /v1/mock-apis/63om1/invitations
                          acl: /v1/mock-apis/63om1/acl{?subjectId}
                          versionHistoryCommits: /v1/mock-apis/63om1/version-history/commits
                        baseUrl: https://63om1.wiremockapi.cloud
                        domainNames:
                          - domainName: 63om1.wiremockapi.cloud
                            urls:
                              - url: https://63om1.wiremockapi.cloud
                              - url: http://63om1.wiremockapi.cloud
                        domains:
                          - 63om1.wiremockapi.cloud
                    aclObjects:
                      - id: 1z6rd
                        objectType: mock-api
                        name: Example Mock API
                        aclGrants:
                          - 9gd5l-1z6rd-mock_api_admin
                        links:
                          self: /v1/acl/objects/1z6rd
                          grants: /v1/acl/grants?aclObjectId=1z6rd
                    openApiGitIntegrations: []
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
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
    MockApis:
      type: object
      properties:
        mockApis:
          type: array
          items:
            $ref: '#/components/schemas/MockApiData'
        meta:
          $ref: '#/components/schemas/PaginationMeta'
        links:
          $ref: '#/components/schemas/PaginationLinks'
      required:
        - mockApis
    MockApiData:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
          maxLength: 256
          description: The display name of the mock API.
        description:
          type: string
          maxLength: 256
          description: The description of the mock API.
        type:
          $ref: '#/components/schemas/MockApiType'
        state:
          type: string
          description: Whether the API is running or stopped.
        adminSecurityEnabled:
          type: boolean
          description: >-
            Whether security is enabled on the mock API's `/__admin/*`
            endpoints.
        createdDate:
          type: string
        aclObject:
          description: The ACL object ID of the entity.
          type: string
        mockHost:
          description: The ID of the mock host where this mock API is located.
          type: string
          nullable: true
        links:
          type: object
          properties:
            self:
              type: string
            requests:
              type: string
            mappings:
              type: string
            scenarios:
              type: string
            securitySettings:
              type: string
            recordings:
              type: object
              properties:
                start:
                  type: string
                stop:
                  type: string
                status:
                  type: string
                snapshot:
                  type: string
              required:
                - start
                - stop
                - status
                - snapshot
            imports:
              type: string
            exports:
              type: object
              properties:
                wiremock:
                  type: string
              required:
                - wiremock
            organisation:
              type: string
            invitations:
              type: string
            acl:
              type: string
              description: The link to the access control list for this mock API.
            versionHistoryCommits:
              type: string
          required:
            - self
            - requests
            - mappings
            - scenarios
            - recordings
            - imports
            - organisation
            - invitations
            - acl
            - versionHistoryCommits
        domainNames:
          type: array
          items:
            type: object
            properties:
              domainName:
                type: string
              urls:
                type: array
                items:
                  type: object
                  properties:
                    url:
                      type: string
                  required:
                    - url
            required:
              - domainName
              - urls
        baseUrl:
          type: string
        domains:
          type: array
          description: The list of domain names that can be used to address this mock API.
          items:
            type: string
      required:
        - id
        - name
        - state
        - adminSecurityEnabled
        - exportState
        - createdDate
        - links
        - domainNames
        - baseUrl
        - domains
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
    MockApiType:
      type: string
      description: >-
        The type of the mock API. Defaults to the "unstructured" type if not
        specified.
      nullable: true
      enum:
        - openapi
        - grpc
        - graphql
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
