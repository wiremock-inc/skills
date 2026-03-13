> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock Runner

> How to use the WireMock Runner

## Overview

The WireMock Runner offers a way to deploy and run long-lived WireMock tasks and control the lifecycle of those tasks
via an HTTP interface.

## Installation

The Runner is published to Docker Hub as [`wiremock/wiremock-runner`](https://hub.docker.com/r/wiremock/wiremock-runner).
Running the image will start the runner and expose the HTTP interface based on the configuration specified via
environment variables.

The following environment variables can be used to configure the runner:

* `WMC_DEFAULT_MODE`: The mode that the runner starts in. Currently, supports `record-many`, `serve`. Defaults to `serve` if omitted.
* `WMC_ADMIN_PORT`: The port that the admin interface is exposed on. Defaults to an available random port.
* `WMC_API_TOKEN`: The API token to use for accessing WireMock Cloud.

You will also need to [publish the appropriate ports](https://docs.docker.com/reference/cli/docker/container/run/#publish)
for the services defined in your environment file along with the port you have configured for the Runner.

Here is a typical example on Linux or macOS when starting the Runner in `record-many` mode:

```shell  theme={null}
docker run \
  -e WMC_DEFAULT_MODE='record-many' \
  -e WMC_ADMIN_PORT='9999' \
  -e WMC_API_TOKEN='<wmc-api-token>' \
  -p 9999:9999 \
  wiremock/wiremock-runner:latest
```

## Switching mode

The Runner will always start in the default mode, configurable via `WMC_DEFAULT_MODE`.
Once running, the Runner's current mode can be changed via an HTTP `PUT` request to `/v1/mode` on the Runner's admin
port, configurable via `WMC_ADMIN_PORT`.
The request must contain a JSON body of the form

```json  theme={null}
{ "mode" : "<DESIRED_MODE>" }
```

with `<DESIRED_MODE>` replaced with one of the Runner's available modes.

Example:

```http request theme={null}
PUT http://localhost:8080/v1/mode
Content-Type: application/json

{ "mode": "serve" }
```

### Mode configuration

Similar to the WireMock CLI, WireMock Runner modes can be configured in a number of ways:
[via a values file](/cli/overview#values-file), [via environment variables](/cli/overview#environment-variables), or via the body of the HTTP switch request.

To configure the mode via the HTTP switch request, a `"config"` field can be provided alongside the `"mode"` field in
the request body.
This `"config"` field must be an object, whose keys have string values and correspond to a relevant configuration field
of the requested mode.
For example, the following HTTP request would configure the WireMock directory and the [batching](/cli/multi-domain-recording#importing-recordings-as-you–go-along)
of the record-many mode:

```http request theme={null}
PUT http://localhost:8080/v1/mode
Content-Type: application/json

{
  "mode": "record-many",
  "config": {
    "wiremock-dir": "path/to/wiremock",
    "max-batch-bytes": "128 MB"
  }
}
```

For details of the specific configuration available to each Runner mode, see the relevant mode's own documentation page.

## Record Many Mode

One of the Runner's available modes is `record-many` mode.
This mode starts a [multi-domain recording](/cli/multi-domain-recording) session that will record requests to your
configured services and flush the results to WireMock Cloud.
More information on this mode can be found in the [WireMock Runner Record Many documentation](/runner/record-many).

## Serve Mode

One of the Runner's available modes is `serve` mode.
This mode starts a [local playback](/cli/local-playback) session that serves your configured services from the Runner's
container.
More information on this mode can be found in the [WireMock Runner Serve documentation](/runner/serve).

## WireMock Runner vs WireMock CLI

[The WireMock CLI](/cli) and the WireMock Runner offer very similar functionality to each other (with the caveat that
the Runner currently exposes a limited subset of the capabilities of the CLI).
In fact, both tools are packaged within the same binary published to [the NPM registry](https://www.npmjs.com/package/@wiremock/cli)
and [Docker Hub](https://hub.docker.com/u/wiremock).
By default, the binary will run the CLI tool, but this can be overridden to execute the Runner by setting the
environment variable `WMC_RUNNER_ENABLED` to `true`.

Example:

```shell  theme={null}
WMC_RUNNER_ENABLED=true wiremock
```

## Runner health check

The WireMock Runner exposes a health check endpoint at `/__/health`.
Performing a `GET` request to this endpoint will return a 200 status code when the Runner is healthy.

This health check can be used by orchestration systems like Kubernetes to detect issues, and is built-in to the Runner's [published docker image](https://hub.docker.com/r/wiremock/wiremock-runner).
More information on using the WireMock Runner in your Kubernetes cluster can be found [here](/runner/running-on-kubernetes).

