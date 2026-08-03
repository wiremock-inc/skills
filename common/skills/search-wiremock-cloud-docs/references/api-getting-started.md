> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Getting Started with the API

> How to use the WireMock Cloud REST API

The WireMock Cloud REST API is served from [https://api.wiremock.cloud/v1](https://api.wiremock.cloud/v1). It accepts and returns `application/json`.

## Authentication

There are three ways to authenticate yourself with the WireMock Cloud API:

### 1. API Token authentication (preferred)

Pass an `Authorization` header of the form `Token <api-key>`:

```http request theme={null}
GET /v1
Authorization: Token <api-key>
Accept: application/json
```

Your API key can be retrieved from the web application at [https://app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security).

Unfortunately while this is our preferred authentication mechanism, it is not supported by the OpenAPI 3.x specification
so it is not the one that features in the generated documentation examples.

### 2. Basic authentication (legacy)

Pass an `Authorization` header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string
`username:api-key`.

```http request theme={null}
GET /v1
Authorization: Basic <encoded-value>
Accept: application/json
```

Your API key can be retrieved from the web application at [https://app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security).

Unfortunately the generated documentation erroneously describes the `<encoded-value>` as the base64-encoded string
`username:password` rather than `username:api-key` - at present we cannot fix this.

### 3. OAuth 2.0 Device Authorization Flow

An enterprise customer wishing to use OAuth 2.0 Access Tokens to authenticate to the WireMock Cloud API, e.g. from their
own CLI, and happy to do more integration work, may request access by
[contacting the WireMock team](https://www.wiremock.io/contact-now) and then
[implement the device authorization flow](/device-authorization-flow).

They can then pass an `Authorization` header of the form `{token_response.token_type} {token_response.access_token}`:

```http request theme={null}
GET /v1
Authorization: {token_response.token_type} {token_response.access_token}
Accept: application/json
```

## Documentation

The full API is documented under [API Reference](/api-reference/users/get-self).

