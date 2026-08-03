> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Pull OpenAPI document from Git



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/mock-apis/{mockApiId}/open-api/pull
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
  /v1/mock-apis/{mockApiId}/open-api/pull:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    post:
      tags:
        - OpenAPI
      summary: Pull OpenAPI document from Git
      operationId: pullOpenAPIFromGit
      requestBody:
        content:
          application/json:
            schema:
              required:
                - pull
              type: object
              properties:
                pull:
                  required:
                    - outOfSyncPolicy
                  type: object
                  properties:
                    outOfSyncPolicy:
                      type: string
                      enum:
                        - abort
                        - overwrite_local_with_remote
                      example: abort
            examples:
              main:
                value:
                  pull:
                    outOfSyncPolicy: abort
        required: true
      responses:
        '202':
          description: Pull job successfully initiated
          content:
            application/json:
              schema:
                required:
                  - job
                type: object
                properties:
                  job:
                    required:
                      - id
                      - jobType
                      - links
                      - started
                      - status
                    type: object
                    properties:
                      id:
                        type: string
                        example: 5947aff3-947b-4dfb-90f5-d324684e97db
                      jobType:
                        type: string
                        example: open-api-git-pull
                      status:
                        type: string
                        example: RUNNING
                      started:
                        type: string
                        example: '2024-09-05T10:20:46.143759190Z'
                      links:
                        required:
                          - self
                        type: object
                        properties:
                          self:
                            type: string
                            example: >-
                              /v1/mock-apis/0ozge/__admin/etc/jobs/5947aff3-947b-4dfb-90f5-d324684e97db
                x-wiremock-hash: 1673969202
              examples:
                main:
                  value:
                    job:
                      id: 5947aff3-947b-4dfb-90f5-d324684e97db
                      jobType: open-api-git-pull
                      status: ERROR
                      started: '2024-09-05T10:20:46.143759190Z'
                      links:
                        self: >-
                          /v1/mock-apis/0ozge/__admin/etc/jobs/5947aff3-947b-4dfb-90f5-d324684e97db
                      finished: '2024-09-05T10:20:46.200386224Z'
                      elapsed: PT0.056627034S
                      outcome:
                        errorCode: NO_LOCAL_HEAD
                        errors:
                          - code: 112
                            title: No previous pull
                            detail: This is the first time pulling from Git.
                  x-parameter-values:
                    mockApiId: 0ozge
components:
  parameters:
    mockApiId:
      in: path
      name: mockApiId
      description: The ID of the Mock API
      required: true
      schema:
        $ref: '#/components/schemas/IdSchema'
  schemas:
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
