> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update user



## OpenAPI

````yaml api-reference/openapi.yaml put /v1/users/{userId}
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
  /v1/users/{userId}:
    summary: User account
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    put:
      tags:
        - Users
      summary: Update user
      operationId: updateUser
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                user:
                  type: object
                  properties:
                    emailAddress:
                      type: string
                    marketingOptIn:
                      type: boolean
                    name:
                      type: string
                  required:
                    - emailAddress
                    - marketingOptIn
              required:
                - user
            examples:
              main:
                value:
                  user:
                    emailAddress: docs@example.com
                    marketingOptIn: false
      responses:
        '200':
          description: 200 response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserAccount'
              examples:
                main:
                  value:
                    user:
                      id: 9gd5l
                      aclObject: 4kg32
                      username: docs@example.com
                      apiKey: 3b35fdee8ff9cf5055d062c28675ee22
                      avatarUrl: >-
                        https://s.gravatar.com/avatar/0dc7361faa5dcde8ee7789f06074bb30?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdo.png
                      emailAddress: docs@example.com
                      marketingOptIn: true
                      signupDate: '2024-08-23T20:15:32.289889Z'
                      idpUserId: auth0|66c8ede29a4b3267bd1c4c42
                      userHash: >-
                        47f058ba304b4e3988f285e8b8f6b37b288fbe93c343578ce2deb37c47a24289
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
                      hasNativeIdp: true
                      aclSubject: 9gd5l
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '422':
          $ref: '#/components/responses/422'
components:
  schemas:
    UserAccount:
      type: object
      properties:
        user:
          $ref: '#/components/schemas/UserData'
      required:
        - user
    UserData:
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
        marketingOptIn:
          type: boolean
        signupDate:
          type: string
        idpUserId:
          type: string
        userHash:
          type: string
        links:
          $ref: '#/components/schemas/UserLinks'
        hasNativeIdp:
          type: boolean
      required:
        - id
        - username
        - avatarUrl
        - emailAddress
        - marketingOptIn
        - signupDate
        - idpUserId
        - userHash
        - links
        - hasNativeIdp
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    UserLinks:
      type: object
      properties:
        self:
          type: string
        features:
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
        plan:
          type: string
        usage:
          type: string
        grants:
          type: string
        catalogue:
          type: string
        next:
          type: string
        previous:
          type: string
        users:
          type: string
        subscription:
          type: string
        invitations:
          type: string
        paymentMethod:
          type: string
        href:
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
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
