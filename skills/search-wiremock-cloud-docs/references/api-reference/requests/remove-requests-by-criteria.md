> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Remove requests by criteria

> Removed requests logged in the journal matching the specified criteria



## OpenAPI

````yaml api-reference/openapi.yaml post /v1/mock-apis/{mockApiId}/requests/remove
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
  /v1/mock-apis/{mockApiId}/requests/remove:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    post:
      tags:
        - Requests
      summary: Remove requests by criteria
      description: Removed requests logged in the journal matching the specified criteria
      operationId: removeRequestsByCriteria
      requestBody:
        $ref: '#/components/requestBodies/requestPattern'
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
  requestBodies:
    requestPattern:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/request-pattern'
          example:
            method: POST
            url: /resource
            headers:
              Content-Type:
                matches: .*/xml
  schemas:
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    request-pattern:
      type: object
      example: |
        {
          "urlPath" : "/charges",
          "method" : "POST",
          "headers" : {
            "Content-Type" : {
              "equalTo" : "application/json"
            }
          }
      properties:
        scheme:
          type: string
          enum:
            - http
            - https
          description: The scheme (protocol) part of the request URL
        host:
          type: string
          description: The hostname part of the request URL
        port:
          type: integer
          minimum: 1
          maximum: 65535
          description: The HTTP port number of the request URL
        method:
          type: string
          pattern: ^[A-Z]+$
          description: The HTTP request method e.g. GET
        url:
          type: string
          description: >-
            The path and query to match exactly against. Only one of url,
            urlPattern, urlPath or urlPathPattern may be specified.
        urlPath:
          type: string
          description: >-
            The path to match exactly against. Only one of url, urlPattern,
            urlPath or urlPathPattern may be specified.
        urlPathPattern:
          type: string
          description: >-
            The path regex to match against. Only one of url, urlPattern,
            urlPath or urlPathPattern may be specified.
        urlPattern:
          type: string
          description: >-
            The path and query regex to match against. Only one of url,
            urlPattern, urlPath or urlPathPattern may be specified.
        pathParameters:
          type: object
          description: >
            Path parameter patterns to match against in the <key>: {
            "<predicate>": "<value>" } form. Can only

            be used when the urlPathPattern URL match type is in use and all
            keys must be present as variables

            in the path template.
          additionalProperties:
            $ref: '#/components/schemas/content-pattern'
        queryParameters:
          type: object
          description: >-
            Query parameter patterns to match against in the <key>: {
            "<predicate>": "<value>" } form
          additionalProperties:
            $ref: '#/components/schemas/content-pattern'
        formParameters:
          type: object
          description: >-
            application/x-www-form-urlencoded form parameter patterns to match
            against in the <key>: { "<predicate>": "<value>" } form
          additionalProperties:
            $ref: '#/components/schemas/content-pattern'
        headers:
          type: object
          description: >-
            Header patterns to match against in the <key>: { "<predicate>":
            "<value>" } form
          additionalProperties:
            $ref: '#/components/schemas/content-pattern'
        basicAuthCredentials:
          type: object
          description: Pre-emptive basic auth credentials to match against
          properties:
            password:
              type: string
            username:
              type: string
          required:
            - username
            - password
        cookies:
          type: object
          description: >-
            Cookie patterns to match against in the <key>: { "<predicate>":
            "<value>" } form
          additionalProperties:
            $ref: '#/components/schemas/content-pattern'
        bodyPatterns:
          type: array
          description: >-
            Request body patterns to match against in the <key>: {
            "<predicate>": "<value>" } form
          items:
            $ref: '#/components/schemas/content-pattern'
        customMatcher:
          oneOf:
            - title: Dynamic State Matcher
              description: >-
                Require the state of the Mock API to match the provided
                patterns. More information on this feature can be found
                [here](../../dynamic-state/overview).
              type: object
              properties:
                name:
                  type: string
                  enum:
                    - require-state
                parameters:
                  type: object
                  properties:
                    requirements:
                      type: array
                      items:
                        allOf:
                          - type: object
                            properties:
                              context:
                                description: >-
                                  The context of the item to match. Can be
                                  templated.
                                type: string
                              key:
                                description: >-
                                  The key of the item to match. Cannot be
                                  templated.
                                type: string
                            required:
                              - key
                          - $ref: '#/components/schemas/content-pattern'
                  required:
                    - requirements
              required:
                - name
                - parameters
            - title: Data Source Matcher
              description: >-
                Fetch some data from a data source and, optionally, only match
                if data is found. More information on this feature can be found
                [here](../../data-sources/overview).
              type: object
              properties:
                name:
                  type: string
                  enum:
                    - data-exists
                parameters:
                  type: object
                  properties:
                    id:
                      description: The ID of the data source to query.
                      type: string
                      minLength: 5
                      maxLength: 10
                      example: jjl8y
                    query:
                      description: >-
                        The WHERE clause to apply to the fetch query. Can be
                        templated.
                      type: string
                      default: ''
                    matcherEnabled:
                      description: >-
                        Whether the fetch query must return some data for the
                        stub to match
                      type: boolean
                      default: true
                  required:
                    - id
              required:
                - name
                - parameters
        multipartPatterns:
          type: array
          description: Multipart patterns to match against headers and body.
          items:
            type: object
            properties:
              name:
                type: string
              matchingType:
                type: string
                description: >-
                  Determines whether all or any of the parts must match the
                  criteria for an overall match.
                default: ANY
                enum:
                  - ALL
                  - ANY
              headers:
                type: object
                description: >-
                  Header patterns to match against in the <key>: {
                  "<predicate>": "<value>" } form
                additionalProperties:
                  $ref: '#/components/schemas/content-pattern'
              bodyPatterns:
                type: array
                description: >-
                  Body patterns to match against in the <key>: { "<predicate>":
                  "<value>" } form
                items:
                  $ref: '#/components/schemas/content-pattern'
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
