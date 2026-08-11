<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Set mock API certificate settings

> Set the certificate settings for a mock API. These settings are used to configure the cryptographic handlebars helpers,
[`sign`](/response-templating/cryptographic-helpers#signing) and [`x509Certificate`](/response-templating/cryptographic-helpers#x-509-certificate).




## OpenAPI

````yaml /api-reference/openapi.yaml put /v1/mock-apis/{mockApiId}/settings/certificate
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
  /v1/mock-apis/{mockApiId}/settings/certificate:
    parameters:
      - $ref: '#/components/parameters/mockApiId'
    put:
      tags:
        - Settings
      summary: Set mock API certificate settings
      description: >
        Set the certificate settings for a mock API. These settings are used to
        configure the cryptographic handlebars helpers,

        [`sign`](/response-templating/cryptographic-helpers#signing) and
        [`x509Certificate`](/response-templating/cryptographic-helpers#x-509-certificate).
      operationId: updateMockApiCertificateSettings
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                certificate:
                  type: object
                  required:
                    - rsa256PublicKey
                    - rsa256PrivateKey
                    - x509Certificate
                    - hmacSecret
                  properties:
                    rsa256PublicKey:
                      type: string
                      description: RSA public key in PEM format.
                    rsa256PrivateKey:
                      type: string
                      description: RSA private key in PEM format.
                    x509Certificate:
                      type: string
                      description: X.509 certificate in PEM format.
                    hmacSecret:
                      type: string
                      description: A non-empty secret key.
            example:
              certificate:
                rsa256PublicKey: |-
                  -----BEGIN RSA PUBLIC KEY-----
                  MIIBIjANBg...kCAwEAAQ==
                  -----END RSA PUBLIC KEY-----
                rsa256PrivateKey: |-
                  -----BEGIN RSA PRIVATE KEY-----
                  MIIEvQIBAD...eXuQIDAQAB
                  -----END RSA PRIVATE KEY-----
                x509Certificate: |-
                  -----BEGIN CERTIFICATE-----
                  MIICpDCCAY...AwggEKAgEA
                  -----END CERTIFICATE-----
                hmacSecret: sup3r-s3cr3t-hmac-k3y
      responses:
        '200':
          description: Settings successfully updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  certificate:
                    type: object
                    required:
                      - rsa256PublicKey
                      - rsa256PrivateKey
                      - x509Certificate
                      - hmacSecret
                    properties:
                      rsa256PublicKey:
                        type: string
                        description: The updated RSA public key.
                      rsa256PrivateKey:
                        type: string
                        description: The updated RSA private key.
                      x509Certificate:
                        type: string
                        description: The updated X.509 certificate.
                      hmacSecret:
                        type: string
                        description: The updated HMAC secret key.
              example:
                certificate:
                  rsa256PublicKey: |-
                    -----BEGIN RSA PUBLIC KEY-----
                    MIIBIjANBg...kCAwEAAQ==
                    -----END RSA PUBLIC KEY-----
                  rsa256PrivateKey: |-
                    -----BEGIN RSA PRIVATE KEY-----
                    MIIEvQIBAD...eXuQIDAQAB
                    -----END RSA PRIVATE KEY-----
                  x509Certificate: |-
                    -----BEGIN CERTIFICATE-----
                    MIICpDCCAY...AwggEKAgEA
                    -----END CERTIFICATE-----
                  hmacSecret: sup3r-s3cr3t-hmac-k3y
        '400':
          $ref: '#/components/responses/400'
        '401':
          $ref: '#/components/responses/401'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '422':
          $ref: '#/components/responses/422'
components:
  parameters:
    mockApiId:
      in: path
      name: mockApiId
      description: The ID of the Mock API
      required: true
      schema:
        $ref: '#/components/schemas/IdSchema'
  responses:
    '400':
      description: 400 Bad Request response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Errors'
          example:
            errors:
              - title: Invalid query parameter format
                detail: The offset parameter value must be a positive integer
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
    '404':
      description: 404 Not Found response
      content:
        application/json:
          schema:
            type: object
            properties:
              code:
                type: integer
              message:
                type: string
            required:
              - message
          example:
            code: 404
            message: HTTP 404 Not Found
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
  schemas:
    IdSchema:
      type: string
      minLength: 5
      maxLength: 10
      example: jjl8y
    Errors:
      type: object
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/SingleError'
      required:
        - errors
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
  securitySchemes:
    tokenAuth:
      type: apiKey
      in: header
      name: Authorization
      description: >-
        Your [API key](https://app.wiremock.cloud/account/security) prefixed by
        'Token '

````