> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get all stub mappings



## OpenAPI

````yaml api-reference/openapi.yaml get /v1/mock-apis/{mockApiId}/mappings
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
  /v1/mock-apis/{mockApiId}/mappings:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    get:
      tags:
        - Stub Mappings
      summary: Get all stub mappings
      operationId: getAllStubMappings
      parameters:
        - description: The maximum number of results to return
          in: query
          name: limit
          required: false
          example: 10
          schema:
            type: integer
        - description: The start index of the results to return
          in: query
          name: offset
          required: false
          example: 0
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/stub-mappings'
              example:
                meta:
                  total: 2
                mappings:
                  - id: 76ada7b0-49ae-4229-91c4-396a36f18e09
                    uuid: 76ada7b0-49ae-4229-91c4-396a36f18e09
                    request:
                      method: GET
                      url: /search?q=things
                      headers:
                        Accept:
                          equalTo: application/json
                    response:
                      status: 200
                      jsonBody:
                        - thing1
                        - thing2
                      headers:
                        Content-Type: application/json
                  - request:
                      method: POST
                      urlPath: /some/things
                      bodyPatterns:
                        - equalToXml: <stuff />
                    response:
                      status: 201
          description: All stub mappings
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
    stub-mappings:
      type: object
      properties:
        mappings:
          type: array
          items:
            $ref: '#/components/schemas/stub-mapping'
        meta:
          type: object
          properties:
            total:
              type: integer
              example: 4
          required:
            - total
      additionalProperties: false
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    stub-mapping:
      type: object
      properties:
        id:
          type: string
          description: This stub mapping's unique identifier
        uuid:
          type: string
          description: Alias for the id
        name:
          type: string
          description: The stub mapping's name
        request:
          $ref: '#/components/schemas/request-pattern'
        response:
          $ref: '#/components/schemas/response-definition'
        persistent:
          type: boolean
          description: >-
            Indicates that the stub mapping should be persisted immediately on
            create/update/delete and survive resets to default.
        priority:
          type: integer
          description: This stub mapping's priority relative to others. 1 is highest.
          minimum: 1
        scenarioName:
          type: string
          description: The name of the scenario that this stub mapping is part of
        requiredScenarioState:
          type: string
          description: >-
            The required state of the scenario in order for this stub to be
            matched.
        newScenarioState:
          type: string
          description: >-
            The new state for the scenario to be updated to after this stub is
            served.
        postServeActions:
          type: object
          description: >-
            A map of the names of post serve action extensions to trigger and
            their parameters.
        serveEventListeners:
          type: array
          description: The list of serve event listeners
          items:
            oneOf:
              - title: Dynamic State Operations
                description: >-
                  Operations to alter the state of your mock API. More
                  information on this feature can be found
                  [here](../../dynamic-state/overview).
                type: object
                properties:
                  name:
                    type: string
                    enum:
                      - change-state
                  parameters:
                    type: object
                    properties:
                      operations:
                        description: >
                          A set of state related operations to perform when the
                          stub is matched.

                          Each operation can be one of the following type,
                          dictated by the `operation` property:

                          * `SET` - set the value of a state item in the state
                          cache.

                          * `DELETE` - delete a state item from the state cache.

                          * `DELETE_CONTEXT` - delete all state items within a
                          context from the state cache.

                          * `REQUEST_VAR` - set a variable that will be
                          available for the lifetime of the request.
                        type: array
                        items:
                          allOf:
                            - type: object
                              properties:
                                operation:
                                  description: The operation to perform.
                                  type: string
                                  enum:
                                    - SET
                                    - DELETE
                                    - DELETE_CONTEXT
                                    - REQUEST_VAR
                              required:
                                - operation
                            - oneOf:
                                - title: SET
                                  type: object
                                  properties:
                                    operation:
                                      enum:
                                        - SET
                                    context:
                                      description: >-
                                        The context of the item to set the value
                                        of. Can be templated.
                                      type: string
                                    key:
                                      description: >-
                                        The key of the item to set the value of.
                                        Can be templated.
                                      type: string
                                    value:
                                      description: >-
                                        The value to set the item to. Can be
                                        templated.
                                      type: string
                                  required:
                                    - context
                                    - key
                                    - value
                                - title: DELETE
                                  type: object
                                  properties:
                                    operation:
                                      enum:
                                        - DELETE
                                    context:
                                      description: >-
                                        The context of the item to delete. Can
                                        be templated.
                                      type: string
                                    key:
                                      description: >-
                                        The key of the item to delete. Can be
                                        templated.
                                      type: string
                                  required:
                                    - context
                                    - key
                                - title: DELETE_CONTEXT
                                  type: object
                                  properties:
                                    operation:
                                      enum:
                                        - DELETE_CONTEXT
                                    context:
                                      description: The context to delete. Can be templated.
                                      type: string
                                  required:
                                    - context
                                - title: REQUEST_VAR
                                  type: object
                                  properties:
                                    operation:
                                      enum:
                                        - REQUEST_VAR
                                    key:
                                      description: >-
                                        The key of the variable to create.
                                        Cannot be templated.
                                      type: string
                                    value:
                                      description: >-
                                        The value to set the variable to. Can be
                                        templated.
                                      type: string
                                  required:
                                    - key
                                    - value
                    required:
                      - operations
        metadata:
          type: object
          description: >-
            Arbitrary metadata to be used for e.g. tagging, documentation. Can
            also be used to find and remove stubs.
      additionalProperties: false
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
    response-definition:
      allOf:
        - type: object
          properties:
            status:
              type: integer
              description: The HTTP status code to be returned
            statusMessage:
              type: string
              description: The HTTP status message to be returned
            headers:
              type: object
              description: Map of response headers to send
              additionalProperties:
                type: string
            additionalProxyRequestHeaders:
              type: object
              description: Extra request headers to send when proxying to another host.
              additionalProperties:
                type: string
            removeProxyRequestHeaders:
              type: array
              description: Request headers to remove when proxying to another host.
              items:
                type: string
            body:
              type: string
              description: >-
                The response body as a string. Only one of body, base64Body,
                jsonBody or bodyFileName may be specified.
            base64Body:
              $ref: '#/components/schemas/base64-string'
            jsonBody:
              description: >-
                The response body as a JSON object. Only one of body,
                base64Body, jsonBody or bodyFileName may be specified.
            bodyFileName:
              type: string
              description: >-
                The path to the file containing the response body, relative to
                the configured file root. Only one of body, base64Body, jsonBody
                or bodyFileName may be specified.
              example: user-profile-responses/user1.json
            fault:
              type: string
              description: The fault to apply (instead of a full, valid response).
              enum:
                - CONNECTION_RESET_BY_PEER
                - EMPTY_RESPONSE
                - MALFORMED_RESPONSE_CHUNK
                - RANDOM_DATA_THEN_CLOSE
            fixedDelayMilliseconds:
              type: integer
              description: Number of milliseconds to delay be before sending the response.
            delayDistribution:
              $ref: '#/components/schemas/delay-distribution'
            chunkedDribbleDelay:
              type: object
              description: >-
                The parameters for chunked dribble delay - chopping the response
                into pieces and sending them at delayed intervals
              properties:
                numberOfChunks:
                  type: integer
                totalDuration:
                  type: integer
              required:
                - numberOfChunks
                - totalDuration
            fromConfiguredStub:
              type: boolean
              description: >-
                Read-only flag indicating false if this was the default,
                unmatched response. Not present otherwise.
            proxyBaseUrl:
              type: string
              description: The base URL of the target to proxy matching requests to.
            proxyUrlPrefixToRemove:
              type: string
              description: >-
                A path segment to remove from the beginning in incoming request
                URL paths before proxying to the target.
            transformerParameters:
              type: object
              description: Parameters to apply to response transformers.
            transformers:
              type: array
              description: List of names of transformers to apply to this response.
              items:
                type: string
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
    base64-string:
      title: Base64 string
      type: string
      pattern: ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
      description: A base64 encoded string used to describe binary data.
    delay-distribution:
      type: object
      description: >-
        The delay distribution. Determines how response delays are distributed
        across requests.
      oneOf:
        - title: Log normal
          description: Log normally distributed random response delay.
          type: object
          properties:
            median:
              type: number
              description: 50th percentile of the distribution in milliseconds.
            sigma:
              type: number
              description: >-
                Standard deviation of the underlying normal distribution. A
                larger value produces a longer tail.
            maxValue:
              type: number
              description: >-
                Maximum value in milliseconds to truncate the distribution at.
                Must be greater than or equal to median. Omit to disable
                truncation.
            type:
              type: string
              enum:
                - lognormal
          required:
            - median
            - sigma
        - title: Uniform
          description: Uniformly distributed random response delay.
          type: object
          properties:
            lower:
              type: integer
              description: Lower bound of the delay range in milliseconds (inclusive).
            upper:
              type: integer
              description: Upper bound of the delay range in milliseconds (inclusive).
            type:
              type: string
              enum:
                - uniform
          required:
            - lower
            - upper
        - title: Fixed
          description: Fixed response delay.
          type: object
          properties:
            milliseconds:
              type: integer
              description: Fixed delay duration in milliseconds.
            type:
              type: string
              enum:
                - fixed
          required:
            - milliseconds
        - title: None
          description: >-
            No delay distribution. Clears any previously configured
            distribution.
          type: object
          properties:
            type:
              type: string
              enum:
                - none
          required:
            - type
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
