> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Invite a user to an organisation



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/organisations/{organisationId}/invitations
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
  /v1/organisations/{organisationId}/invitations:
    parameters:
      - $ref: '#/components/parameters/organisationId'
      - in: query
        name: q
        description: >-
          The search query to filter by. Partially matched against recipient
          email address.
        required: false
        schema:
          type: string
          example: docs@example.com
    post:
      tags:
        - Organisations
      summary: Invite a user to an organisation
      operationId: inviteUserToOrganisation
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InvitationRequest'
            examples:
              main:
                value:
                  invitation:
                    role: organisation_admin
                    recipientEmailAddress: docsmember2@example.com
              with-acl-object:
                value:
                  invitation:
                    role: team_member
                    aclObjectId: 8ndxc
                    recipientEmailAddress: docsmember2@example.com
        required: true
      responses:
        '201':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Invitation'
              examples:
                main:
                  value:
                    invitation:
                      id: neqek
                      senderId: 9gd5l
                      recipientEmailAddress: tom+docsmember2@wiremock.io
                      newUser: true
                      role: organisation_admin
                      created: '2024-10-30T19:28:23.802551Z'
                      links:
                        self: /v1/organisations/mgk7g/invitations/neqek
                with-acl-object:
                  value:
                    invitation:
                      id: neqek
                      senderId: 9gd5l
                      recipientEmailAddress: docsmember2@example.com
                      newUser: true
                      role: team_member
                      aclObjectId: 8ndxc
                      created: '2024-10-30T19:28:23.802551Z'
                      links:
                        self: /v1/organisations/mgk7g/invitations/neqek
components:
  parameters:
    organisationId:
      in: path
      name: organisationId
      description: The ID of the organisation
      required: true
      schema:
        $ref: '#/components/schemas/IdSchema'
  schemas:
    InvitationRequest:
      required:
        - invitation
      type: object
      properties:
        invitation:
          required:
            - recipientEmailAddress
            - role
          type: object
          properties:
            role:
              type: string
              enum:
                - organisation_admin
                - organisation_member
                - team_admin
                - team_member
                - mock_api_admin
                - mock_api_editor
                - mock_api_user
                - api_template_admin
                - api_template_editor
                - api_template_user
                - api_template_catalogue_admin
                - api_template_catalogue_editor
                - api_template_catalogue_user
                - data_source_admin
                - data_source_editor
                - data_source_user
                - key_admin
                - key_editor
                - key_user
              example: organisation_admin
              description: The role of the new user within the organisation.
            aclObjectId:
              type: string
              description: >
                The ACL ID of the entity to invite the user to join. The `role`
                field must be valid for the type of ACL entity the user is being
                invited to. For instance, if the ACL entity is a team, the
                provided `role` must be either `team_member` or `team_admin`. If
                null, the user is not invited to a particular entity, but simply
                to the organisation.
              example: 8ndxc
              nullable: true
            recipientEmailAddress:
              type: string
              example: docsmember2@example.com
              description: The email address of the user being invited.
    Invitation:
      required:
        - invitation
      type: object
      properties:
        invitation:
          $ref: '#/components/schemas/InvitationData'
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    InvitationData:
      required:
        - created
        - id
        - links
        - newUser
        - recipientEmailAddress
        - role
        - senderId
      type: object
      properties:
        id:
          type: string
          example: neqek
        senderId:
          type: string
          example: 9gd5l
          description: The ID of the user sending the invitation.
        recipientEmailAddress:
          type: string
          example: tom+docsmember2@wiremock.io
          description: The email address of the user being invited.
        newUser:
          type: boolean
          example: true
          description: Indicates whether the invited user already existed in the system.
        role:
          type: string
          description: The role of the new user within the organisation.
          enum:
            - organisation_admin
            - organisation_member
            - team_admin
            - team_member
            - mock_api_admin
            - mock_api_editor
            - mock_api_user
            - api_template_admin
            - api_template_editor
            - api_template_user
            - api_template_catalogue_admin
            - api_template_catalogue_editor
            - api_template_catalogue_user
            - data_source_admin
            - data_source_editor
            - data_source_user
            - key_admin
            - key_editor
            - key_user
        aclObjectId:
          type: string
          description: >-
            The ACL ID of the entity the user is invited to join. If null, the
            user is not invited to a particular entity, but simply to the
            organisation.
          example: 8ndxc
          nullable: true
        created:
          type: string
          example: '2024-10-30T19:28:23.802551Z'
        links:
          required:
            - self
          type: object
          properties:
            self:
              type: string
              example: /v1/organisations/mgk7g/invitations/neqek
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
