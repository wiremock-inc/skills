> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete requests mappings matching metadata



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/mock-apis/{mockApiId}/requests/remove-by-metadata
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
  /v1/mock-apis/{mockApiId}/requests/remove-by-metadata:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    post:
      tags:
        - Requests
      summary: Delete requests mappings matching metadata
      operationId: removeRequestsByMetadata
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/content-pattern'
            example:
              matchesJsonPath:
                expression: $.outer
                equalToJson: '{ "inner": 42 }'
      responses:
        '200':
          description: Removed request details
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
    content-pattern:
      type: object
      title: Content pattern
      oneOf:
        - $ref: '#/components/schemas/equal-to-pattern'
        - $ref: '#/components/schemas/binary-equal-to-pattern'
        - $ref: '#/components/schemas/contains-pattern'
        - $ref: '#/components/schemas/does-not-contain-pattern'
        - $ref: '#/components/schemas/matches-pattern'
        - $ref: '#/components/schemas/does-not-match-pattern'
        - $ref: '#/components/schemas/not-pattern'
        - $ref: '#/components/schemas/before-pattern'
        - $ref: '#/components/schemas/after-pattern'
        - $ref: '#/components/schemas/equal-to-date-time-pattern'
        - $ref: '#/components/schemas/equal-to-json-pattern'
        - $ref: '#/components/schemas/matches-json-path-pattern'
        - $ref: '#/components/schemas/equal-to-xml-pattern'
        - $ref: '#/components/schemas/matches-xpath-pattern'
        - $ref: '#/components/schemas/matches-json-schema-pattern'
        - $ref: '#/components/schemas/absent-pattern'
        - $ref: '#/components/schemas/and-pattern'
        - $ref: '#/components/schemas/or-pattern'
        - $ref: '#/components/schemas/has-exactly-multivalue-pattern'
        - $ref: '#/components/schemas/includes-multivalue-pattern'
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    equal-to-pattern:
      title: String equals
      type: object
      required:
        - equalTo
      properties:
        equalTo:
          type: string
        caseInsensitive:
          type: boolean
    binary-equal-to-pattern:
      title: Binary equals
      type: object
      required:
        - binaryEqualTo
      properties:
        binaryEqualTo:
          $ref: '#/components/schemas/base64-string'
    contains-pattern:
      title: String contains
      type: object
      properties:
        contains:
          type: string
      required:
        - contains
    does-not-contain-pattern:
      title: String does not contain
      type: object
      properties:
        doesNotContain:
          type: string
      required:
        - doesNotContain
    matches-pattern:
      title: Regular expression match
      type: object
      properties:
        matches:
          type: string
      required:
        - matches
    does-not-match-pattern:
      title: Negative regular expression match
      type: object
      properties:
        doesNotMatch:
          type: string
      required:
        - doesNotMatch
    not-pattern:
      title: NOT modifier
      type: object
      properties:
        not:
          $ref: '#/components/schemas/content-pattern'
      required:
        - not
    before-pattern:
      title: Before datetime
      type: object
      properties:
        before:
          $ref: '#/components/schemas/dateTimeExpression'
        actualFormat:
          $ref: '#/components/schemas/format'
        truncateExpected:
          $ref: '#/components/schemas/truncation'
        truncateActual:
          $ref: '#/components/schemas/truncation'
      required:
        - before
    after-pattern:
      title: Before datetime
      type: object
      properties:
        after:
          $ref: '#/components/schemas/dateTimeExpression'
        actualFormat:
          $ref: '#/components/schemas/format'
        truncateExpected:
          $ref: '#/components/schemas/truncation'
        truncateActual:
          $ref: '#/components/schemas/truncation'
      required:
        - after
    equal-to-date-time-pattern:
      title: Before datetime
      type: object
      properties:
        equalToDateTime:
          $ref: '#/components/schemas/dateTimeExpression'
        actualFormat:
          $ref: '#/components/schemas/format'
        truncateExpected:
          $ref: '#/components/schemas/truncation'
        truncateActual:
          $ref: '#/components/schemas/truncation'
      required:
        - equalToDateTime
    equal-to-json-pattern:
      title: JSON equals
      type: object
      properties:
        equalToJson:
          type: string
          example: |
            { "message": "hello" }
        ignoreExtraElements:
          type: boolean
        ignoreArrayOrder:
          type: boolean
      required:
        - equalToJson
    matches-json-path-pattern:
      title: JSONPath match
      type: object
      properties:
        matchesJsonPath:
          oneOf:
            - type: string
              example: $.name
            - type: object
              allOf:
                - properties:
                    expression:
                      type: string
                      example: $.name
                - $ref: '#/components/schemas/content-pattern'
              required:
                - expression
      required:
        - matchesJsonPath
    equal-to-xml-pattern:
      title: XML equality
      type: object
      properties:
        equalToXml:
          type: string
          example: <amount>123</amount>
        enablePlaceholders:
          type: boolean
        placeholderOpeningDelimiterRegex:
          type: string
          example: '['
        placeholderClosingDelimiterRegex:
          type: string
          example: ']'
      required:
        - equalToXml
    matches-xpath-pattern:
      title: XPath match
      type: object
      properties:
        matchesXPath:
          oneOf:
            - type: string
              example: //Order/Amount
            - type: object
              allOf:
                - properties:
                    expression:
                      type: string
                      example: //Order/Amount
                - $ref: '#/components/schemas/content-pattern'
              required:
                - expression
        xPathNamespaces:
          type: object
          additionalProperties:
            type: string
      required:
        - matchesXPath
    matches-json-schema-pattern:
      title: JSON Schema match
      type: object
      properties:
        matchesJsonSchema:
          oneOf:
            - type: string
              example: //Order/Amount
            - type: object
              allOf:
                - properties:
                    expression:
                      type: string
                      example: //Order/Amount
                - $ref: '#/components/schemas/content-pattern'
              required:
                - expression
        xPathNamespaces:
          type: object
          additionalProperties:
            type: string
      required:
        - matchesJsonSchema
    absent-pattern:
      title: Absent matcher
      type: object
      properties:
        absent:
          type: boolean
      required:
        - absent
    and-pattern:
      title: Logical AND matcher
      type: object
      properties:
        and:
          type: array
          items:
            $ref: '#/components/schemas/content-pattern'
      required:
        - and
    or-pattern:
      title: Logical AND matcher
      type: object
      properties:
        or:
          type: array
          items:
            $ref: '#/components/schemas/content-pattern'
      required:
        - or
    has-exactly-multivalue-pattern:
      title: Has exactly multi value matcher
      type: object
      properties:
        hasExactly:
          type: array
          items:
            $ref: '#/components/schemas/content-pattern'
      required:
        - hasExactly
    includes-multivalue-pattern:
      title: Has exactly multi value matcher
      type: object
      properties:
        includes:
          type: array
          items:
            $ref: '#/components/schemas/content-pattern'
      required:
        - includes
    base64-string:
      title: Base64 string
      type: string
      pattern: ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
      description: A base64 encoded string used to describe binary data.
    dateTimeExpression:
      type: string
      example: now +3 days
    format:
      type: string
      example: yyyy-MM-dd
    truncation:
      type: string
      enum:
        - first second of minute
        - first minute of hour
        - first hour of day
        - first day of month
        - first day of next month
        - last day of month
        - first day of year
        - first day of next year
        - last day of year
      example: first day of month
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````
