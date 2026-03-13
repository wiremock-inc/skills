> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Serve Mode via the WireMock Runner

> How to use Serve Mode with the WireMock Runner

## Serve Mode

One of the Runner's available modes is `serve` mode.
The runner can be started in `serve` mode by setting the `WMC_DEFAULT_MODE` environment variable to `serve`,
or switched to this mode using the Runner's [switch endpoint](/runner/overview#switching-mode).
This mode starts a [local playback](/cli/local-playback) session that will continue to serve your configured services
until the runner is stopped or its mode is switched.

### Serve Configuration

The serve session started by the Runner can be configured via the same mechanism as the [`run` command](/cli/local-playback)
of the WireMock CLI - either [via a values file](/cli/overview#values-file) or [via environment variables](/cli/overview#environment-variables).
Additionally, configuration can be provided at switch time [via the HTTP request body](/runner/overview#mode-configuration).

All options available to the [`run` CLI command](/cli/local-playback) are also available to the Runner's `serve` mode.
When specifying an option in the [`"config"` field of the HTTP switch request](/runner/overview#mode-configuration), remove the dash (`-`) prefix that would normally be used when provided on the command line.
For instance, the [`--profile` option](/cli/environments) would become `"profile"` in the request body, like so:

```json  theme={null}
{
  "mode": "record-many",
  "config": {
    "profile": "staging"
  }
}
```

Just like the WireMock CLI, by default the Runner will expect a WireMock environment file in the `.wiremock` directory
in the current working directory of the container.

### Starting the Runner In Serve Mode

When starting the runner in `serve` mode you will need to [publish the appropriate ports](https://docs.docker.com/reference/cli/docker/container/run/#publish)
for the services you are running along with the port you have configured for the Runner.

Here is a typical example on Linux or macOS when running the Runner on port `9999` and serving two services:

```shell  theme={null}
docker run \
  -e WMC_DEFAULT_MODE='serve' \
  -e WMC_ADMIN_PORT='9999' \
  -e WMC_API_TOKEN='<wmc-api-token>' \
  -v ./.wiremock/:/work/.wiremock/ \
  -p 9999:9999 \
  -p 8080:8080 \
  -p 8081:8081 \
  wiremock/wiremock-runner:latest
```

## Extensions

The WireMock Runner's `serve` mode can be customised in the same way as [WireMock OSS](https://wiremock.org/docs/extending-wiremock/).
More information on how to extend the WireMock Runner can be found [here](/runner/serve-mode-extensions).

## Telemetry

The WireMock Runner's `serve` mode can be configured to export OpenTelemetry signals to a backend of your choice.
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

These telemetry options also apply to [the `wiremock run` command](/cli/local-playback#telemetry).

