> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Find unmatched requests

> Get details of logged requests that weren't matched by any stub mapping



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/requests/unmatched
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
  /v1/mock-apis/{mockApiId}/requests/unmatched:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Requests
      summary: Find unmatched requests
      description: Get details of logged requests that weren't matched by any stub mapping
      operationId: findUnmatchedRequests
      responses:
        '200':
          description: Unmatched request details
          content:
            application/json:
              example:
                requests:
                  - url: /my/url
                    absoluteUrl: http://mydomain.com/my/url
                    method: GET
                    headers:
                      Accept-Language: en-us,en;q=0.5
                      User-Agent: >-
                        Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:9.0)
                        Gecko/20100101 Firefox/9.0
                      Accept: image/png,image/*;q=0.8,*/*;q=0.5
                    body: ''
                    browserProxyRequest: true
                    loggedDate: 1339083581823
                    loggedDateString: '2012-06-07 16:39:41'
                  - url: /my/other/url
                    absoluteUrl: http://my.other.domain.com/my/other/url
                    method: POST
                    headers:
                      Accept: text/plain
                      Content-Type: text/plain
                    body: My text
                    browserProxyRequest: false
                    loggedDate: 1339083581823
                    loggedDateString: '2012-06-07 16:39:41'
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
