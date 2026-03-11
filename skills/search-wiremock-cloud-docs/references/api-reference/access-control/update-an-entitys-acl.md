> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update an entity's ACL

> Add or update a team or user to an entity's ACL.



## OpenAPI

````yaml api-reference/openapi.yaml put /v1/{entityCollection}/{entityId}/acl/{subjectType}/{subjectEntityId}
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
  /v1/{entityCollection}/{entityId}/acl/{subjectType}/{subjectEntityId}:
    put:
      tags:
        - Access control
      summary: Update an entity's ACL
      description: Add or update a team or user to an entity's ACL.
      operationId: putEntityAcl
      parameters:
        - $ref: '#/components/parameters/EntityCollection'
        - $ref: '#/components/parameters/EntityId'
        - $ref: '#/components/parameters/SubjectType'
        - $ref: '#/components/parameters/SubjectEntityId'
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Grant'
            examples:
              main:
                value:
                  grant:
                    role: mock_api_editor
        required: true
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Grant'
              examples:
                main:
                  value:
                    grant:
                      role: mock_api_editor
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
    SubjectType:
      name: subjectType
      description: The type of subject in the context of an ACL.
      in: path
      required: true
      schema:
        type: string
        enum:
          - user
          - team
          - organisation
      example: user
    SubjectEntityId:
      name: subjectEntityId
      description: The ID of a subject entity (user, team, organisation)
      in: path
      required: true
      schema:
        $ref: '#/components/schemas/IdSchema'
  schemas:
    Grant:
      required:
        - grant
      type: object
      properties:
        grant:
          required:
            - role
          type: object
          properties:
            role:
              type: string
              description: >
                The friendly ID of the role. Valid values are dependent on the
                entity type

                e.g. when the entity type is `mock-api` the valid roles are the
                ones prefixed with `mock_api_`
              enum:
                - mock_api_user
                - mock_api_editor
                - mock_api_admin
                - team_member
                - team_admin
                - organisation_member
                - organisation_admin
              example: mock_api_editor
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
