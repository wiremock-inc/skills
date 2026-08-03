> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get ACL candidates

> Get candidate users and teams that can be added to this entity's ACL



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/{entityCollection}/{entityId}/acl/candidates
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
  /v1/{entityCollection}/{entityId}/acl/candidates:
    get:
      tags:
        - Access control
      summary: Get ACL candidates
      description: Get candidate users and teams that can be added to this entity's ACL
      operationId: getAclCandidatesForEntity
      parameters:
        - $ref: '#/components/parameters/EntityCollection'
        - $ref: '#/components/parameters/EntityId'
        - $ref: '#/components/parameters/Limit'
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
          description: ACL candidates
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EntityAclCandidates'
              examples:
                main:
                  value:
                    candidates:
                      - name: All in organisation
                        links:
                          self:
                            href: /v1/mock-apis/l36le/acl/organisation/mgk7g
                      - name: Elite Team
                        links:
                          self:
                            href: /v1/mock-apis/l36le/acl/team/p9e4r
components:
  parameters:
    EntityCollection:
      name: entityCollection
      description: >-
        Specifies the plural of the entity type for which ACL candidates should
        be retrieved.
      in: path
      required: true
      schema:
        type: string
        enum:
          - mock-apis
          - data-sources
      example: mock-apis
    EntityId:
      name: entityId
      description: The ID of the entity (mock API, data source etc.)
      in: path
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
  schemas:
    EntityAclCandidates:
      required:
        - candidates
      type: object
      properties:
        candidates:
          type: array
          items:
            required:
              - links
              - name
            type: object
            properties:
              name:
                type: string
                example: All in organisation
              links:
                required:
                  - self
                type: object
                properties:
                  self:
                    required:
                      - href
                    type: object
                    properties:
                      href:
                        type: string
                        example: /v1/mock-apis/l36le/acl/organisation/mgk7g
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
