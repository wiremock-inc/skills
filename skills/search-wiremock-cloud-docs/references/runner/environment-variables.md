> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Runner environment variables

> Reference documentation for all environment variables that can be used with WireMock Runner

This page documents all environment variables that can be used to configure the WireMock Runner.

## Core Runner configuration

These environment variables control the fundamental behavior of the WireMock Runner.

### WMC\_RUNNER\_ENABLED

Enables Runner mode when using the WireMock binary. By default, the binary runs the CLI tool, but setting this variable to `true` will execute the Runner instead.

**Type:** Boolean
**Default:** `false`
**Example:**

```shell  theme={null}
WMC_RUNNER_ENABLED=true wiremock
```

<Note>
  You should never need to set this variable yourself except when building your own Docker image to wrap WireMock Runner.

  This can be safely ignored if using WireMock's official Docker image.
</Note>

### WMC\_DEFAULT\_MODE

The mode that the Runner starts in. Once running, the mode can be changed via the [HTTP switch endpoint](/runner/overview#switching-mode).

**Type:** String
**Valid values:** `record-many`, `serve`
**Default:** `serve`
**Example:**

```shell  theme={null}
docker run \
  -e WMC_DEFAULT_MODE='record-many' \
  wiremock/wiremock-runner:latest
```

### WMC\_ADMIN\_PORT

The port that the Runner's admin interface is exposed on. The admin interface provides endpoints for switching modes and flushing recordings.

**Type:** Integer
**Default:** Random available port
**Example:**

```shell  theme={null}
docker run \
  -e WMC_ADMIN_PORT='9999' \
  -p 9999:9999 \
  wiremock/wiremock-runner:latest
```

### WMC\_API\_TOKEN

The API token used to authenticate with WireMock Cloud. This token is required for operations that interact with WireMock Cloud, such as flushing recordings in `record-many` mode or pulling stub mappings.

**Type:** String
**Required:** Yes
**Example:**

```shell  theme={null}
docker run \
  -e WMC_API_TOKEN='your-api-token-here' \
  wiremock/wiremock-runner:latest
```

<Note>
  You can find your API token in the [WireMock Cloud console](https://app.wiremock.cloud/account/security) or by running `wiremock config get api-token` if you've logged in via the CLI.
</Note>

## Configuration file location

### WMC\_VALUES\_CONFIG\_FILE

Overrides the default path for the values configuration file. By default, the Runner looks for `.wiremock/config.yaml` in the working directory.

**Type:** String (file path)
**Default:** `.wiremock/config.yaml`
**Example:**

```shell  theme={null}
docker run \
  -e WMC_VALUES_CONFIG_FILE='/custom/path/config.yaml' \
  wiremock/wiremock-runner:latest
```

<Note>
  Setting the `--wiremock-dir` option does not affect where the CLI/Runner searches for the default values file. Use `WMC_VALUES_CONFIG_FILE` to specify a custom location.
</Note>

## Mode-specific configuration

The Runner supports the same configuration options as the WireMock CLI for its respective modes. You can set any CLI option using environment variables following the pattern `WMC_<MODE_NAME>_<OPTION_NAME>`.

### Pattern for mode-specific variables

Environment variable names follow this pattern:

* Prefix: `WMC_`
* Mode name: `RUN_` (for serve mode) or `RECORD_MANY_` (for record-many mode)
* Option name: The CLI option name with dashes replaced by underscores

### Examples

#### Serve mode configuration

For `serve` mode, equivalent to the [`run` CLI command](/cli/local-playback):

```shell  theme={null}
# Set the request log level for serve mode
WMC_RUN_REQUEST_LOG_LEVEL=full

# Set the WireMock directory for serve mode
WMC_RUN_WIREMOCK_DIR=/custom/path

# Enable watch mode for serve mode
WMC_RUN_WATCH=true
```

#### Record-many mode configuration

For `record-many` mode, equivalent to the [`record-many` CLI command](/cli/multi-domain-recording):

```shell  theme={null}
# Set the request log level for record-many mode
WMC_RECORD_MANY_REQUEST_LOG_LEVEL=full

# Configure services to include in recording
WMC_RECORD_MANY_INCLUDE_SERVICES=api1,api2

# Configure batch size for recording
WMC_RECORD_MANY_MAX_BATCH_BYTES=128MB
```

### Profile configuration via mode-specific variables

Profiles define which Mock APIs in WireMock Cloud are mapped to which local services. These environment variables allow you to specify which profile to use for different Runner modes.

#### WMC\_RUN\_PROFILE

Specifies the profile to use when the Runner is in `serve` mode. This determines which Mock APIs are served and on which ports.

**Type:** String
**Default:** `default` profile from `wiremock.yaml`
**Example:**

```yaml  theme={null}
# In Kubernetes manifest
- name: WMC_RUN_PROFILE
  value: "development"
```

#### WMC\_RECORD\_MANY\_PROFILE

Specifies the profile to use when the Runner is in `record-many` mode. This determines which services are recorded and which Mock APIs in WireMock Cloud receive the recorded stubs.

**Type:** String
**Default:** `default` profile from `wiremock.yaml`
**Example:**

```yaml  theme={null}
# In Kubernetes manifest
- name: WMC_RECORD_MANY_PROFILE
  value: "development"
```

### Available options

For a complete list of available options for each mode, see:

* [Local playback (`run`) options](/cli/local-playback) for `serve` mode
* [Multi-domain recording (`record-many`) options](/cli/multi-domain-recording) for `record-many` mode

## Configuration precedence

When the same option is configured in multiple places, the following precedence order applies (highest to lowest):

1. HTTP request body (when switching modes via the [switch endpoint](/runner/overview#mode-configuration))
2. Environment variables
3. Values file (`.wiremock/config.yaml`)
4. Default values

This allows you to set baseline configuration in a values file, override it with environment variables for different deployments, and temporarily override specific options when switching modes.

## See also

* [Runner overview](/runner/overview) - General information about the WireMock Runner
* [CLI configuration](/cli/overview#environment-variables) - Details on CLI environment variable patterns
* [Serve mode](/runner/serve) - Using the Runner in serve mode
* [Record-many mode](/runner/record-many) - Using the Runner in record-many mode

