> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# wiremock.yaml Configuration Reference

> Complete reference documentation for the wiremock.yaml configuration file format

The `wiremock.yaml` file is used by the WireMock CLI to configure local mock services. It defines service configurations including HTTP/HTTPS ports, TLS certificates, API types, and cloud synchronization settings.

## File location

The `wiremock.yaml` file should be placed in your WireMock working directory (typically `.wiremock` by default, or as specified with the `--wiremock-dir` argument).

## Schema validation

The configuration file conforms to the JSON Schema specification available at:
[https://static.wiremock.io/schemas/wiremock.yaml-schema.json](https://static.wiremock.io/schemas/wiremock.yaml-schema.json)

## Root structure

```yaml  theme={null}
global:
  # Global configuration (optional)
services:
  # Service definitions (required)
```

## Global configuration

The `global` section contains configuration that applies to all services by default.

### Global HTTPS settings

```yaml  theme={null}
global:
  https:
    certificate:
      # Certificate configuration (see Certificate Configuration section)
```

When a global certificate is configured, all services with an `https` section will use it by default unless they specify their own certificate.

## Services

The `services` section is a map of service names to their configurations. Service names are user-defined identifiers.

```yaml  theme={null}
services:
  my-service-name:
    # Service configuration
  another-service:
    # Service configuration
```

### Required service properties

Each service must define these properties:

#### type

The type of mock API.

* **Type:** `string`
* **Required:** Yes
* **Valid values:** `REST`, `Unstructured`, `gRPC`, `GraphQL` (case insensitive)

```yaml  theme={null}
type: REST
```

#### name

Human-readable name for the service.

* **Type:** `string`
* **Required:** Yes

```yaml  theme={null}
name: "Invoicing API"
```

#### port

HTTP port number for the service.

* **Type:** `integer`
* **Required:** Yes (or `https` must be provided)
* **Valid range:** 1-65535

```yaml  theme={null}
port: 8080
```

### Optional service properties

#### description

Optional description of the service.

* **Type:** `string`
* **Required:** No

```yaml  theme={null}
description: "Mock API for the invoicing system"
```

#### cloud\_id

WireMock Cloud mock API ID for syncing with cloud.

* **Type:** `string`
* **Required:** No
* **Pattern:** 4-15 lowercase alphanumeric characters

```yaml  theme={null}
cloud_id: abc123xyz
```

This field is automatically populated when pulling a mock API from WireMock Cloud.

#### path

Path to the directory containing stub mappings, files, and API specifications. The path is relative to the location of `wiremock.yaml`.

* **Type:** `string`
* **Required:** No

```yaml  theme={null}
path: ./my-service
```

This directory typically contains items needed to run the service.  For example:

* `stub-mappings.yaml` - Stub mapping yaml file
* `schema.graphql` or `openapi.yaml` - Mock API IDL documents such as OpenAPI/GraphQL schema

#### open\_api

OpenAPI-specific configuration for validation.

* **Type:** `object`
* **Required:** No

```yaml  theme={null}
open_api:
  validation_mode: soft
```

**Properties:**

* `validation_mode` - Controls OpenAPI request/response validation
  * **Type:** `string`
  * **Valid values:** `none`, `soft`, `hard`
  * **Default:** `none`
  * `none` - No validation
  * `soft` - Validation warnings logged but requests not rejected
  * `hard` - Invalid requests are rejected

#### https

HTTPS configuration for the service. See the [TLS/HTTPS Configuration](#tlshttps-configuration) section below.

* **Type:** `object`
* **Required:** No (but either `port` or `https` must be provided)

```yaml  theme={null}
https:
  port: 8443
  certificate:
    pem: /path/to/cert.pem
```

#### originals

Map of original service URLs for recording and proxying.

* **Type:** `object`
* **Required:** No

```yaml  theme={null}
originals:
  default: https://api.example.com
  staging: https://staging-api.example.com
```

The keys in this map can be referenced when using recording features to specify which target service to record from.

## TLS/HTTPS configuration

Services can be configured to run over HTTPS using TLS certificates. TLS can be configured globally (for all services) or per-service.

### HTTPS service configuration

```yaml  theme={null}
services:
  my-service:
    type: REST
    name: "Secure API"
    https:
      port: 8443
      certificate:
        # Certificate configuration
```

**Properties:**

* `port` - HTTPS port number (required, 1-65535)
* `certificate` - Certificate configuration (optional, inherits from global if not specified)

### Certificate configuration

Certificates can be configured in three ways:

#### PEM file

A PEM-encoded file containing both the RSA private key and X509 certificate.

```yaml  theme={null}
certificate:
  pem: /path/to/certificate.pem
```

The path can be absolute or relative to the `wiremock.yaml` file.

**PEM file format:**

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHIpsyRDeM1lFQ
... (base64-encoded content)
GhxuZ3ceXiqwvhH8Yt5gNs0=
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIDrzCCApegAwIBAgIUR24W6NZN7xPwSqc59usFQ37HPYswDQYJKoZIhvcNAQEL
... (base64-encoded content)
dHhXPaefkEhrsUbnXGYRfwQhf4SzdYCMCJno7KKsNn6RLIo=
-----END CERTIFICATE-----
```

#### PKCS12 or JKS keystore

A keystore file (PKCS12 or JKS format) containing the private key and certificate.

```yaml  theme={null}
certificate:
  keystore: /path/to/keystore.p12
  password: very_secret
  alias: my_cert  # optional
```

**Properties:**

* `keystore` - Path to the keystore file (absolute or relative to `wiremock.yaml`)
* `password` - Password to unlock the keystore (required)
* `alias` - Optional alias to select a specific certificate if the keystore contains multiple entries. If omitted, the first entry is used.

#### Certificate alias reference

When a global keystore is configured, individual services can reference specific certificates by alias:

```yaml  theme={null}
global:
  https:
    certificate:
      keystore: /path/to/keystore.p12
      password: very_secret

services:
  service-one:
    type: REST
    name: "Service One"
    https:
      port: 8443
      certificate:
        alias: service_one_cert

  service-two:
    type: REST
    name: "Service Two"
    https:
      port: 8444
      certificate:
        alias: service_two_cert
```

### Default self-signed certificate

If no certificate is configured, services will use WireMock's default self-signed certificate.

## Profiles

Configuration overrides can be defined in profile files named `wiremock-<profile-name>.yaml`.
These files overlay the base configuration when running commands with the `--profile`/`-p` flag.

See [Managing Environments](/cli/environments) for more information about using profiles to manage environments in WireMock Cloud.

## Complete example

```yaml  theme={null}
global:
  https:
    certificate:
      keystore: /etc/wiremock/certs/global-keystore.p12
      password: global_password
      alias: default_cert

services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    description: "Mock API for invoicing system"
    cloud_id: ndzew
    port: 8080
    https:
      port: 8443
    path: ./invoicing-api
    open_api:
      validation_mode: soft
    originals:
      default: https://api.example.com/invoicing

  payment-api:
    type: REST
    name: "Payment API"
    cloud_id: wroog
    port: 8081
    https:
      port: 8444
      certificate:
        alias: payment_cert
    path: ./payment-api

  graphql-service:
    type: GraphQL
    name: "GraphQL Gateway"
    port: 9090
    path: ./graphql-gateway
    originals:
      default: https://graphql.example.com

  grpc-service:
    type: gRPC
    name: "gRPC Service"
    https:
      port: 50051
      certificate:
        pem: ./certs/grpc-service.pem
    path: ./grpc-service
```

## See also

* [Running mock APIs locally](/cli/local-playback)
* [Recording configuration](/cli/recording-configuration)

