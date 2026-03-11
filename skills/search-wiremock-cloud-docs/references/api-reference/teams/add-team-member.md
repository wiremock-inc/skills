> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Add team member



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/teams/{teamId}/members
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
    post:
      tags:
        - Teams
      summary: Add team member
      operationId: addTeamMember
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddMemberRequest'
            examples:
              main:
                value:
                  member:
                    memberId: eglq6
                    permissionFriendlyId: team_member
        required: true
      responses:
        '201':
          description: Member added
components:
  schemas:
    AddMemberRequest:
      type: object
      properties:
        member:
          required:
            - memberId
            - permissionFriendlyId
          type: object
          properties:
            memberId:
              type: string
              description: The ID of the team member to add.
              example: eglq6
            permissionFriendlyId:
              type: string
              enum:
                - team_member
                - team_admin
              description: >-
                The role the member will have in the team. Must be one of
                team_member or team_admin.
              example: team_member
      required:
        - member
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
