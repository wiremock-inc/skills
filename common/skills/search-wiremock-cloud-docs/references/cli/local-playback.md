> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Running Mock APIs Locally

> How to use the WireMock CLI to run your Mock APIs locally with the same capabilities as on WireMock Cloud

For enterprise customers the CLI offers the possibility of running your Mock APIs locally, removing the need to have a
connection to the internet.

## Usage

First you will need to pull one or more of your Mock APIs locally.  This can be done by running the `pull mock-api`
command as detailed [here](./push-pull-mock-api).

Once you have pulled one or more of your Mock APIs, you can then run them as so:

```shell  theme={null}
wiremock run
```

This will run all the Mock APIs you have pulled down into the `.wiremock` directory. A table will be printed showing you
which port is being used for which API.

(Naturally you can pass the same `--wiremock-dir` argument to override the default `.wiremock` directory.)

### TLS Usage

You can run your Mock APIs locally using a TLS certificate of your choice. You configure this by editing the local
environment config file, `.wiremock/wiremock.yaml`, and specifying your https settings:

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

If you do not provide any certificate details, your services will run using our default self-signed certificate.

## Running in a Container

The CLI is published to Docker Hub as [`wiremock/wiremock-cli`](https://hub.docker.com/r/wiremock/wiremock-cli). By
default, it executes the `run` command, but in order for the `run` command to be able to operate you must mount your
config directory to `/etc/wiremock-cli` and the working directory containing your mock APIs to `/work`.

You will also need to [publish the appropriate ports](https://docs.docker.com/reference/cli/docker/container/run/#publish)
for the services you are running.

Here is a typical example on Linux or macOs when running two Mock APIs:

```shell  theme={null}
docker run \
  -v ~/.config/wiremock-cli:/etc/wiremock-cli \
  -v $(pwd):/work \
  -p 8080:8080 \
  -p 8081:8081 \
  wiremock/wiremock-cli:latest
```

## Telemetry

The `wiremock run` command can be configured to export OpenTelemetry signals to a backend of your choice.
Configuration is done via environment variables, as specified by [the OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/).

For example, to emit logs to a backend that supports [OTLP](https://opentelemetry.io/docs/specs/otel/protocol/)
at the endpoint `https://my-telemetry-service:8080`, set the following environment variables:

* `OTEL_LOGS_EXPORTER=otlp`.
* `OTEL_EXPORTER_OTLP_ENDPOINT=https://my-telemetry-service:8080`.

Supported values for `OTEL_TRACES_EXPORTER`, `OTEL_METRICS_EXPORTER`, `OTEL_LOGS_EXPORTER` are:

* `otlp`: [OTLP](https://opentelemetry.io/docs/specs/otel/protocol/exporter/)
* `console`: [Standard Output](https://opentelemetry.io/docs/specs/otel/logs/sdk_exporters/stdout/)
* `none`: No automatically configured exporter.

If no OTEL environment variables are set, the specification defaults are obeyed, except `OTEL_TRACES_EXPORTER`,
`OTEL_METRICS_EXPORTER`, and `OTEL_LOGS_EXPORTER`, which are all set to `none` by default, rather than `otlp`.

These telemetry options also apply to [the WireMock Runner's `serve` mode](/runner/serve#telemetry).

