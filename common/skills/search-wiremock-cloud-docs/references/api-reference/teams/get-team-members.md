> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get team members



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/teams/{teamId}/members
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
  /v1/teams/{teamId}/members:
    parameters:
      - in: path
        name: teamId
        required: true
        schema:
          type: string
      - in: query
        name: q
        description: >-
          The search query to filter by. Partially matched against username and
          email address.
        required: false
        schema:
          type: string
          example: docs@example.com
    get:
      tags:
        - Teams
      summary: Get team members
      operationId: getTeamMembers
      responses:
        '200':
          description: Successfully fetched team members
          content:
            application/json:
              schema:
                required:
                  - members
                type: object
                properties:
                  members:
                    type: array
                    items:
                      $ref: '#/components/schemas/UserSummary'
              examples:
                main:
                  value:
                    members:
                      - id: 6j84g
                        username: docs-teamboss@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/57cd30a5c7ebfb10eee28b5fbf85e84d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
                        emailAddress: docs-teamboss@example.com
                        links:
                          self: /v1/users/6j84g
                          features: /v1/users/6j84g/features
                          progress: /v1/users/6j84g/progress
                          teams: /v1/users/6j84g/teams
                          mockApis: /v1/users/6j84g/apis
                          apiTemplateCatalogues: /v1/users/6j84g/api-template-catalogues
                          apiTemplates: /v1/users/6j84g/api-templates
                          dataSources: /v1/users/6j84g/data-sources
                          keys: /v1/users/6j84g/jwks
                          organisation: /v1/organisations/p0wqg
                          aclSubject: /v1/acl/subjects/6j84g
                          aclObject: /v1/acl/objects/ne523
                      - id: 5j7yy
                        username: docs-member1@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/470b2b63990f8fe4067e306dd5c59e90?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
                        emailAddress: docs-member1@example.com
                        links:
                          self: /v1/users/5j7yy
                          features: /v1/users/5j7yy/features
                          progress: /v1/users/5j7yy/progress
                          teams: /v1/users/5j7yy/teams
                          mockApis: /v1/users/5j7yy/apis
                          apiTemplateCatalogues: /v1/users/5j7yy/api-template-catalogues
                          apiTemplates: /v1/users/5j7yy/api-templates
                          dataSources: /v1/users/5j7yy/data-sources
                          keys: /v1/users/5j7yy/jwks
                          organisation: /v1/organisations/p0wqg
                          aclSubject: /v1/acl/subjects/5j7yy
                          aclObject: /v1/acl/objects/xqg2l
                      - id: ke6lg
                        username: docs-member2@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/d3082c4a60301ca176854d00626bbca9?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
                        emailAddress: docs-member2@example.com
                        links:
                          self: /v1/users/ke6lg
                          features: /v1/users/ke6lg/features
                          progress: /v1/users/ke6lg/progress
                          teams: /v1/users/ke6lg/teams
                          mockApis: /v1/users/ke6lg/apis
                          apiTemplateCatalogues: /v1/users/ke6lg/api-template-catalogues
                          apiTemplates: /v1/users/ke6lg/api-templates
                          dataSources: /v1/users/ke6lg/data-sources
                          keys: /v1/users/ke6lg/jwks
                          organisation: /v1/organisations/p0wqg
                          aclSubject: /v1/acl/subjects/ke6lg
                          aclObject: /v1/acl/objects/x62ov
                      - id: vrder
                        username: docs-member3@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/d0ba6024454dc96288e06b29c7fe1507?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
                        emailAddress: docs-member3@example.com
                        links:
                          self: /v1/users/vrder
                          features: /v1/users/vrder/features
                          progress: /v1/users/vrder/progress
                          teams: /v1/users/vrder/teams
                          mockApis: /v1/users/vrder/apis
                          apiTemplateCatalogues: /v1/users/vrder/api-template-catalogues
                          apiTemplates: /v1/users/vrder/api-templates
                          dataSources: /v1/users/vrder/data-sources
                          keys: /v1/users/vrder/jwks
                          organisation: /v1/organisations/p0wqg
                          aclSubject: /v1/acl/subjects/vrder
                          aclObject: /v1/acl/objects/ndzvw
                      - id: eglq6
                        username: docs-member5@example.com
                        avatarUrl: >-
                          https://s.gravatar.com/avatar/32755f65c467c3627e5eef2a08b1b0bc?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
                        emailAddress: docs-member5@example.com
                        links:
                          self: /v1/users/eglq6
                          features: /v1/users/eglq6/features
                          progress: /v1/users/eglq6/progress
                          teams: /v1/users/eglq6/teams
                          mockApis: /v1/users/eglq6/apis
                          apiTemplateCatalogues: /v1/users/eglq6/api-template-catalogues
                          apiTemplates: /v1/users/eglq6/api-templates
                          dataSources: /v1/users/eglq6/data-sources
                          keys: /v1/users/eglq6/jwks
                          organisation: /v1/organisations/p0wqg
                          aclSubject: /v1/acl/subjects/eglq6
                          aclObject: /v1/acl/objects/pyvog
components:
  schemas:
    UserSummary:
      type: object
      properties:
        id:
          type: string
          example: 6j84g
        username:
          type: string
          example: docs-teamboss@example.com
        avatarUrl:
          type: string
          example: >-
            https://s.gravatar.com/avatar/57cd30a5c7ebfb10eee28b5fbf85e84d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fto.png
        emailAddress:
          type: string
          example: docs-teamboss@example.com
        links:
          required:
            - apiTemplateCatalogues
            - apiTemplates
            - dataSources
            - features
            - keys
            - mockApis
            - organisation
            - progress
            - self
            - teams
          type: object
          properties:
            self:
              type: string
              example: /v1/users/6j84g
            features:
              type: string
              example: /v1/users/6j84g/features
            progress:
              type: string
              example: /v1/users/6j84g/progress
            teams:
              type: string
              example: /v1/users/6j84g/teams
            mockApis:
              type: string
              example: /v1/users/6j84g/apis
            apiTemplateCatalogues:
              type: string
              example: /v1/users/6j84g/api-template-catalogues
            apiTemplates:
              type: string
              example: /v1/users/6j84g/api-templates
            dataSources:
              type: string
              example: /v1/users/6j84g/data-sources
            keys:
              type: string
              example: /v1/users/6j84g/jwks
            organisation:
              type: string
              example: /v1/organisations/p0wqg
      required:
        - avatarUrl
        - emailAddress
        - id
        - links
        - username
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
