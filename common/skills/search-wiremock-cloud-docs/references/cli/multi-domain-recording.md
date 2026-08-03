> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Multi-domain recording using the WireMock CLI

> How to use the WireMock CLI to record stubs from multiple private endpoints

The CLI offers a convenient way to record stubs from multiple endpoints that are accessible from the computer running
the CLI, but not accessible from the internet. This is achieved by the use of the cli `record-many` command and the
WireMock environment config file, `wiremock.yaml`. The environment configuration file specifies all the services you are
recording:

```yaml  theme={null}
services:
  invoicing-api:
    type: <mock_api_type>
    name: "Invoicing API"
    port: 8888
    cloud_id: <mock_api_id>
    originals:
      default: http://private-endpoint1
  payment-api:
    type: <mock_api_type>
    name: "Payment API"
    port: 9999
    cloud_id: <mock_api_id>
    originals:
      default: http://private-endpoint2
```

In the above configuration file, the `cloud_id` field specifies the Mock API you want to save to where `<mock_api_id>`
is the ID of the Mock API that should receive the recorded stubs. At present you can get that value by browsing into a
Mock API at [https://app.wiremock.cloud](https://app.wiremock.cloud) and extracting it from the URL - for instance in the URL
`https://app.wiremock.cloud/mock-apis/33eye3l9/stubs/1e0d7dc0-06a0-49a2-81a7-f5d6a40bfa3d`, the ID is `33eye3l9`.

If you don't already have a Mock API in WireMock Cloud that you are recording to, you can omit the `cloud_id` field
from your service definition and the WireMock CLI will create a new Mock API for you before saving the recorded stubs.
The environment config file will be updated with the ID of the created Mock Api.

The `type` field specifies the type of the Mock API you are saving to. This field allows the 4 Mock API types supported
by WireMock Cloud:

* REST
* gRPC
* GraphQL
* Unstructured

The `port` field allows you to specify the port number the WireMock CLI will listen on when recording to the endpoint
specified in the `originals` -> `default` field. The `port` field specified should be unique across all the services
you are specifying in your environment configuration.  This is unless you are using a dynamic port where you would
specify `0` or `-1` as the port.

To start a multi-domain recording session, you would run:

```shell  theme={null}
wiremock record-many --wiremock-dir <path>
```

Where `<path>` is the path to the directory containing your saved `wiremock.yaml` environment configuration file. By
default this will be a directory called `.wiremock` in the current working directory, so the CLI will look for
`./.wiremock/wiremock.yaml`.

The CLI will then run a proxy server for each of the services you have configured, bound to `http://localhost:<port>`
where the port is the port you specified in the configuration file. Requests to those endpoints will be proxied to the
endpoint you want to record from. When you have finished the journey you want to record, press `<enter>` to save the
stubs to your Mock API in WireMock Cloud and the CLI will exit.

## Choosing which services to record

It may be convenient to run a multi-domain recording session where all services defined in the environment configuration
file are proxying through to the real service, but you only wish to actually record stubs for a subset of those
services.

You can achieve this using the `--include-services` option with a value that is a comma separated list of the  YAML keys
(as defined in the environment configuration file) of the services you wish to record.

```shell  theme={null}
wiremock record-many --include-services invoicing-api,payment-api
```

Only services in this list will be recorded; however, if the option is omitted entirely all services in the environment
configuration file will be recorded.

## Importing recordings as you go along

By default, all the recorded requests are held in memory, and sent to the destination Mock API in WireMock Cloud at the
end of the recording session.

This may not be desirable; if you are doing a long recording session this may be prone to losing too much work. If you
are doing a very large recording session the resulting import may be too large for WireMock Cloud (or other intermediate
infrastructure) to cope.

You may use the `--max-batch-requests` option to specify the maximum amount of requests to import into the destination
Mock API in a single request.
Given a max batch of N requests, an import to the mock API will occur for every N requests recorded.

The `--max-batch-bytes` option is also available if you need control over the exact amount of bytes that can be sent in
a single request to the destination Mock API.
Given a max batch of N bytes, an import to the mock API will occur for every N bytes recorded.
Note, if a single recorded request exceeds the maximum number of bytes, this request will still be sent (in a batch of
one).

## Advanced Recording

The WireMock CLI accepts a configuration file to control how stubs are recorded:

```shell  theme={null}
wiremock record-many --import-config-file=<path>
```

The format of this file is documented in the [advanced recording configuration page](/cli/recording-configuration).

## Recording with TLS

You can run your recording proxy using a TLS certificate of your choice.
This can be configured by editing the local environment config file, `.wiremock/wiremock.yaml`, and specifying your HTTPS settings:

```yaml  theme={null}
services:
  local-running-service-name:
    https:
      port: <local port to bind to>
      certificate: <certificate details>
```

If you have a file containing a PEM encoded RSA private key and X509 certificate, you can provide it as so:

```yaml  theme={null}
certificate:
  pem: /path/to/file.pem
```

A PEM encoded file should look something like this:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHIpsyRDeM1lFQ
<multiple lines of base64 encoded data>
GhxuZ3ceXiqwvhH8Yt5gNs0=
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIDrzCCApegAwIBAgIUR24W6NZN7xPwSqc59usFQ37HPYswDQYJKoZIhvcNAQEL
<multiple lines of base64 encoded data>
dHhXPaefkEhrsUbnXGYRfwQhf4SzdYCMCJno7KKsNn6RLIo=
-----END CERTIFICATE-----
```

If you have a PKCS 12 key store containing your private key and X509 certificate, you can provide it as so:

```yaml  theme={null}
certificate:
  keystore: /path/to/keystore.p12
  password: very_secret
  alias: key_alias # optional - if omitted, the first entry in the key store is used
```

If you wish to use the same certificate across multiple services, you may specify it as so:

```yaml  theme={null}
global:
  https:
    certificate: <certificate details>
services:
  local-running-service-name:
    https:
      port: <local port to bind to>
```

Any service with an `https` section will then use that certificate by default.

You may still provide a specific certificate for any individual service:

```yaml  theme={null}
global:
  https:
    certificate:
      pem: /path/to/global-cert.pem
services:
  service-using-specific-certificate:
    https:
      port: <local port to bind to>
      certificate:
        pem: /path/to/specific-cert.pem
  service-using-default-certificate:
    https:
      port: <local port to bind to>
```

In addition, you can specify a global keystore but reference different certificates in it by alias for a given service:

```yaml  theme={null}
global:
  https:
    certificate:
      keystore: /path/to/keystore.p12
      password: very_secret
      alias: default_key_alias
services:
  service-using-specific-alias:
    https:
      port: <local port to bind to>
      certificate:
        alias: service_specific_key_alias
  service-using-default-alias:
    https:
      port: <local port to bind to>
```

If you do not provide any certificate details, the proxy will use our default self-signed certificate.

## Recording with Mutual TLS

If you need to record from an API that authenticates clients with mutual TLS, the CLI can present your private client
certificate in one of two ways:

### Via a PEM file

If you have a file containing a PEM encoded RSA private key and X509 certificate, you can provide it as so:

```shell  theme={null}
wiremock record-many \
  --client-certificate=/path/to/file.pem
```

A PEM encoded file should look something like this:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHIpsyRDeM1lFQ
<multiple lines of base64 encoded data>
GhxuZ3ceXiqwvhH8Yt5gNs0=
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIDrzCCApegAwIBAgIUR24W6NZN7xPwSqc59usFQ37HPYswDQYJKoZIhvcNAQEL
<multiple lines of base64 encoded data>
dHhXPaefkEhrsUbnXGYRfwQhf4SzdYCMCJno7KKsNn6RLIo=
-----END CERTIFICATE-----
```

### Using a PKCS 12 certificate store

Keeping a private key in PEM format is a security risk, so we also support supplying your client certificate in a
password protected PKCS 12 store as so:

```shell  theme={null}
wiremock record-many \
  --client-certificate-store=/path/to/file.pkcs12
```

You will be challenged for a password to decrypt the store and the private key. The same password must be able to
decrypt both.

## Hostname rewriting

Often API responses contain absolute links and other content that refers to the domain name of the API's origin.
When recording an API this can be undesirable as the local proxy is different from the API being recorded, and thus any
client following such a link would make its next request directly to the proxy target rather than the local CLI running
the proxy.

To remedy this issue, the Record-Many command has **hostname rewriting enabled by default**, which will replace any
instances of the proxy target's domain name and port in the response headers or body with the local proxy's domain name
and port.

If this is not the behaviour you want when recording, you can configure hostname rewriting on a per-service basis by adding
the `rewriteOriginHostname` field to the service:

```yaml  theme={null}
services:
  invoicing-api:
    type: <mock_api_type>
    name: "Invoicing API"
    port: 8888
    cloud_id: <mock_api_id>
    rewriteOriginHostname: false
    originals:
      default: http://private-endpoint1
  payment-api:
    type: <mock_api_type>
    name: "Payment API"
    port: 9999
    cloud_id: <mock_api_id>
    originals:
      default: http://private-endpoint2
```

This can also be configured for all services in the `global` configuration section of your `wiremock.yaml` file:

```yaml  theme={null}
global:
  rewriteOriginHostname: false

services:
  invoicing-api:
    type: <mock_api_type>
    name: "Invoicing API"
    port: 8888
    cloud_id: <mock_api_id>
    originals:
      default: http://private-endpoint1
  payment-api:
    type: <mock_api_type>
    name: "Payment API"
    port: 9999
    cloud_id: <mock_api_id>
    originals:
      default: http://private-endpoint2
```

After setting `rewriteOriginHostname: false` globally, you can still enable it for specific services.

## Non-interactive Recording Sessions

The WireMock CLI `record-many` command supports running in non-interactive mode, making it ideal for
CI/CD pipelines and automated environments where user interaction is not possible or desired. See the
[Non-interactive Recording](/cli/non-interactive-recording) for more details.

## Recording to an Environment

The WireMock CLI `record-many` command supports recording to an environment via the use of the `--profile` parameter.
See the [Environments](/cli/environments) page for more details.

## Recording gRPC Services

The WireMock CLI and WireMock Runner support recording gRPC APIs, but require some additional configuration to other API types.
In order for the recorder to intercept and marshall gRPC requests and responses, a [descriptor file](/grpc/overview#generating-a-descriptor-set-file) must be provided.

If a gRPC mock API already exists in WireMock Cloud ([with a descriptor file uploaded](/grpc/overview#uploading-a-descriptor-set-file)),
then running the `pull mock-api` command, as detailed [here](/cli/push-pull-mock-api), will ensure the descriptor file is available to the recorder.

For newly recorded gRPC APIs, add a `path` field to the gRPC service configuration in your `.wiremock/wiremock.yaml`
file whose value is a file path pointing to a directory containing a descriptor file named `grpc.dsc`.
For example, given a `wiremock.yaml` file with the following contents

```yaml  theme={null}
services:
  my-grpc-service:
    type: gRPC
    name: "My gRPC Service"
    port: 8888
    path: ./my-grpc-service
    originals:
      default: https://grpc.example.com
```

the file tree must resemble the following structure

```
.wiremock
├── my-grpc-service
│   └── grpc.dsc
└── wiremock.yaml
```

