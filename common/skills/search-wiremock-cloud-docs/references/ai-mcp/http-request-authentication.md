> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# HTTP Request Authentication

> Authenticating HTTP requests made with the `make_http_request` MCP tool using authenticators

## Overview

The `make_http_request` tool in WireMock CLI provides automatic authentication support for HTTP requests through configurable authenticators.
This allows AI agents to make authenticated HTTP calls without credentials being visible to the LLM.

This is most useful when using an AI plus WireMock MCP to explore or "crawl" an API, recording it in order
to create a mock API and OpenAPI description.

For instance, if you wanted to automate the exploration of an internal microservice's API you would first add an authenticator to your configuration file, start your AI tool, then instruct it to start
crawling the API.

## How Authentication Works

1. **Domain-based Matching**: When making an HTTP request, the tool extracts the domain and port from the target URL
2. **Authenticator Lookup**: It searches for a matching authenticator configuration based on the domain
3. **Automatic Header Injection**: If a matching authenticator is found, the appropriate authentication header is automatically added to the request
4. **Request Execution**: The request is executed with the authentication header included

### Domain Matching Format

The domain matching key follows this format:

* `hostname:port` for non-standard ports (e.g., `api.example.com:8443`)
* `hostname` for standard ports (e.g., `api.example.com` for HTTPS on port 443)

## Configuration Format

Authentication configurations are stored in the `config.yaml` configuration file under your home directory, in the `authenticators` section.

### Configuration File Location

The configuration file is located at:

* **macOS/Linux**: `~/.wiremock/config.yaml`
* **Windows**: `%USERPROFILE%\.wiremock\config.yaml`

### Basic Structure

```yaml  theme={null}
authenticators:
  "api.example.com":
    type: "header_token"
    headerName: "Authorization"
    prefix: "Bearer"
    token: "your-secret-token"
  
  "internal-api.company.com:8080":
    type: "header_token"
    headerName: "x-api-key"
    prefix: "Token"
    token: "very-secret-123"
```

## Supported Authenticator Types

### 1. Header Token Authenticator

The most common authentication method using a static token in a header.

**Type**: `header_token`

**Configuration Parameters**:

* `headerName` (string): The name of the HTTP header (e.g., "Authorization", "X-API-Key")
* `prefix` (string): Optional prefix for the token value (e.g., "Bearer", "Token")
* `token` (string): The authentication token value

**Example Configuration**:

```yaml  theme={null}
authenticators:
  "api.example.com":
    type: "header_token"
    headerName: "Authorization"
    prefix: "Bearer"
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  
  "api.service.com":
    type: "header_token"
    headerName: "X-API-Key"
    prefix: ""
    token: "sk-1234567890abcdef"
```

**Generated Header Examples**:

* With prefix: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
* Without prefix: `X-API-Key: sk-1234567890abcdef`

