> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Record Many Mode via the WireMock Runner

> How to use Record Many Mode with the WireMock Runner

## Record Many Mode

One of the Runner's available modes is `record-many` mode.
The runner can be started in `record-many` mode by setting the `WMC_DEFAULT_MODE` environment variable to `record-many`,
or switched to this mode using the Runner's [switch endpoint](/runner/overview#switching-mode).
This mode starts a [multi-domain recording](/cli/multi-domain-recording) session that will continue to record until the
runner is stopped or its mode is switched.

### Record Many Configuration

The record many session started by the Runner can be configured via the same mechanism as the [`record-many` command](/cli/multi-domain-recording)
of the WireMock CLI - either [via a values file](/cli/overview#values-file) or [via environment variables](/cli/overview#environment-variables).
Additionally, configuration can be provided at switch time [via the HTTP request body](/runner/overview#mode-configuration).

All options available to the [`record-many` CLI command](/cli/multi-domain-recording) are also available to the Runner's `record-many` mode.
When specifying an option in the [`"config"` field of the HTTP switch request](/runner/overview#mode-configuration), remove the dash (`-`) prefix that would normally be used when provided on the command line.
For instance, the [`--include-services` option](/cli/multi-domain-recording#choosing-which-services-to-record) would become `"include-services"` in the request body, like so:

```json  theme={null}
{
  "mode": "record-many",
  "config": {
    "include-services": "invoicing-api,payment-api"
  }
}
```

Just like the WireMock CLI, by default the Runner will expect a WireMock environment file in the `.wiremock` directory
in the current working directory of the container.

### Flushing Recordings

The `record-many` mode will honour the [batching configuration](/cli/recording#importing-recordings-as-you-go-along) you
have specified in your config file.  The Runner also defines an endpoint which can be used to flush the recorded requests
to WireMock Cloud independently of the batching configuration:

* `POST /v1/record-many/flush`

<Warning>
  When the Runner is stopped or switched out of record-many mode, recorded requests will not be flushed automatically.
  To ensure all your recordings are saved to WireMock Cloud, call [`POST
      /v1/record-many/flush`](/runner/record-many#flushing-recordings) before stopping the recording session.
</Warning>

### Starting the Runner In Record Many Mode

When starting the runner in `record-many` mode you will need to [publish the appropriate ports](https://docs.docker.com/reference/cli/docker/container/run/#publish)
for the services you are running along with the port you have configured for the Runner.

Here is a typical example on Linux or macOS when running the Runner on port `9999` and recording to two Mock APIs:

```shell  theme={null}
docker run \
  -e WMC_DEFAULT_MODE='record-many' \
  -e WMC_ADMIN_PORT='9999' \
  -e WMC_API_TOKEN='<wmc-api-token>' \
  -v ./.wiremock/:/work/.wiremock/ \
  -p 9999:9999 \
  -p 8080:8080 \
  -p 8081:8081 \
  wiremock/wiremock-runner:latest
```

