> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a new mock API



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/mock-apis
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
  /v1/mock-apis:
    post:
      tags:
        - Mock APIs
      summary: Create a new mock API
      operationId: createMockApi
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMockApiRequest'
            examples:
              main:
                value:
                  mockApi:
                    name: My new mock API
                    hostname: my-new-mock-api
                    apiTemplateId: 8nd5x
      responses:
        '201':
          description: 201 Created response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MockApi'
              examples:
                main:
                  value:
                    mockApi:
                      id: jjl8y
                      aclObject: gkqjy
                      name: My new mock API
                      description: This is a sample mock API for testing purposes.
                      state: RUNNING
                      adminSecurityEnabled: true
                      exportState: EXPORT_ALLOWED
                      createdDate: '2024-08-23T21:34:36.595372Z'
                      openApiGitIntegration: jjl8y-openapi-integration-git
                      links:
                        self: /v1/mock-apis/jjl8y
                        requests: /v1/mock-apis/jjl8y/requests
                        mappings: /v1/mock-apis/jjl8y/mappings
                        scenarios: /v1/mock-apis/jjl8y/scenarios
                        recordings:
                          start: /v1/mock-apis/jjl8y/recordings/start
                          stop: /v1/mock-apis/jjl8y/recordings/stop
                          status: /v1/mock-apis/jjl8y/recordings/status
                          snapshot: /v1/mock-apis/jjl8y/recordings/snapshot
                        imports: /v1/mock-apis/jjl8y/imports
                        organisation: /v1/organisations/mgk7g
                        apiTemplate: /v1/api-templates/8nd5x
                        aclObject: /v1/acl/objects/gkqjy
                        aclRoles: /v1/acl/objects/gkqjy/roles
                        invitations: /v1/mock-apis/jjl8y/invitations
                        acl: /v1/mock-apis/jjl8y/acl{?subjectId}
                        versionHistoryCommits: /v1/mock-apis/jjl8y/version-history/commits
                      baseUrl: https://jjl8y.wiremockapi.cloud
                      domainNames:
                        - domainName: my-new-mock-api.wiremockapi.cloud
                          editableSubdomainPart: my-new-mock-api
                          urls:
                            - url: https://my-new-mock-api.wiremockapi.cloud
                            - url: http://my-new-mock-api.wiremockapi.cloud
                        - domainName: jjl8y.wiremockapi.cloud
                          urls:
                            - url: https://jjl8y.wiremockapi.cloud
                            - url: http://jjl8y.wiremockapi.cloud
                      domains:
                        - jjl8y.wiremockapi.cloud
                        - my-new-mock-api.wiremockapi.cloud
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '422':
          $ref: '#/components/responses/422'
        '500':
          $ref: '#/components/responses/500'
components:
  schemas:
    CreateMockApiRequest:
      type: object
      properties:
        mockApi:
          type: object
          properties:
            name:
              type: string
              maxLength: 256
              description: The display name of the mock API.
            description:
              type: string
              maxLength: 256
              description: The description of the mock API.
            apiTemplateId:
              type: string
              description: >-
                The ID of the API template from which to derive this mock API.
                The mock API will be blank if this is not specified.
            type:
              $ref: '#/components/schemas/MockApiType'
            hostname:
              type: string
              description: >
                The friendly, unqualified domain name for this mock API's base
                URL

                e.g. in the SaaS edition, for a base URL of
                `https://my-api.wiremockapi.cloud` this value should be set to
                `my-api`.
          required:
            - name
    MockApi:
      type: object
      properties:
        mockApi:
          $ref: '#/components/schemas/MockApiData'
      required:
        - mockApi
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
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
    ServerError:
      type: object
      properties:
        code:
          type: number
        message:
          type: string
      required:
        - code
        - message
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
    '500':
      description: 500 Server Error response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ServerError'
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
