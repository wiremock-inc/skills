> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Pushing and Pulling Mock API

> How to use the WireMock CLI to push and pull entire Mock APIs

## Pulling a Mock API from WireMock Cloud

The CLI allows you to pull down a Mock API from WireMock Cloud.  This is required if you want to run a Mock API locally
via the [local runner](./local-playback).

Mock APIs can be pulled down by running the following command:

```shell  theme={null}
wiremock pull mock-api <mock-api-id>
```

Multiple Mock APIs can be pulled with one command by appending multiple ids:

```shell  theme={null}
wiremock pull mock-api <mock-api-id> <mock-api-id> <mock-api-id>
```

At present you can get the Mock API ID by browsing into a Mock API at [https://app.wiremock.cloud](https://app.wiremock.cloud) and extracting it from
the URL - for instance in the URL `https://app.wiremock.cloud/mock-apis/33eye3l9/stubs/1e0d7dc0-06a0-49a2-81a7-f5d6a40bfa3d`,
the ID is `33eye3l9`.

This will create a `.wiremock` directory in the current working dir, and populate it with the necessary files to be able
to run the identified Mock API.

You can pass a `--wiremock-dir` argument to override the default `.wiremock` directory.

Inside the `.wiremock` directory you will find the WireMock environment file which contains all the Mock APIs you have
pulled down.  This is a `yaml` file in the following format:

```yaml  theme={null}
services:
  <service-id>:
    type: '<mock_api_type>'
    name: 'Mock API name'
    cloud_id: '<mock-api-id>'
    path: './mock-api-name'
    port: 8080
```

The `type` field specifies the type of the Mock API you have just pulled down. This field allows the 4 Mock API types
supported by WireMock Cloud:

* REST
* gRPC
* GraphQL
* Unstructured

The `port` field specifies the port that the local mock api will run on.

The `path` field specifies the path to the Mock API directory.  This is where all the files relating to the Mock API
will be stored.  If the Mock API contains any stubs, they will be stored in the `stub-mappings.yaml` file along with
the OpenAPI specification if the Mock API is a REST Mock API and the GraphQL schema if the Mock API is a GraphQL Mock API.

### Re-pulling Mock APIs defined in the WireMock environment file

If you have modified your Mock APIs in WireMock Cloud, you can re-pull them by running the `pull mock-api` command
again.  This will overwrite any changes you have made locally.  To do this you can run the same command as before\
specifying the Mock API ID:

```shell  theme={null}
wiremock pull mock-api <mock-api-id>
```

Or multiple Mock APIs can be pulled with one command by appending multiple ids:

```shell  theme={null}
wiremock pull mock-api <mock-api-id> <mock-api-id> <mock-api-id>
```

Or you can run the `pull mock-api` command specifying the `<service-id>` from your local WireMock environment file:

For example, if your WireMock environment file contains the following:

```yaml  theme={null}
services:
  payment-mock-api:
    type: 'Unstructured'
    name: 'Payment Mock API'
    cloud_id: '23der3'
    path: './payment-mock-api'
    port: 8080
```

You can re-pull the Mock API by running the following command:

```shell  theme={null}
wiremock pull mock-api payment-mock-api
```

As with pulling multiple Mock APIs, you can re-pull multiple services by appending multiple `<service-id>`:

```shell  theme={null}
wiremock pull mock-api payment-mock-api order-mock-api
```

If you want to re-pull all the Mock APIs you have defined in your local WireMock environment file, you can run the
`pull mock-api` command without any mock API ID or service ID and specifying the `--all` flag:

```shell  theme={null}
wiremock pull mock-api --all
```

The `--into=<service-id>` flag can be used to pull data into an existing service in the WireMock environment file. In
this case, only stub mappings and API documents will be updated; service settings in wiremock.yaml will remain unchanged.

### Pulling Mock APIs from an Environment

The WireMock CLI `pull` command supports pulling mock APIs from an environment via the use of the `--profile` parameter.
When doing so, the `--into` parameter is not allowed to be used.  The `--profile` parameter can be used to specify the
name of the environment to pull from.  When pulling from an environment, the pull command only pulls the content of the
mock APIs and the environment file is not updated.

See the [Environments](/cli/environments#pulling-mock-apis-from-an-environment) page for more details.

## Pushing a Mock API to WireMock Cloud

As well as pulling down Mock APIs, you can push them back up to the WireMock Cloud.  This is useful if you have made any
changes to your stubs or api definition documents locally and want those changes to be reflected in the WireMock Cloud.

To push a Mock API to WireMock Cloud, run the following command:

```shell  theme={null}
wiremock push mock-api <service-id>
```

You can also push multiple Mock APIs at once by appending multiple `<service-id>`:

```shell  theme={null}
wiremock push mock-api payment-mock-api order-mock-api
```

By default, the local Mock API will be pushed to the Mock API with the same `cloud_id` from the WireMock environment file.
This can be overridden by specifying the `--to=cloud:<cloud-id>` flag.  If you want to push the local Mock API to a
new Mock API, you can specify the `--to=cloud:new` flag.

As with the `pull` command, you can pass a `--wiremock-dir` argument to override the default `.wiremock` directory.

If the `cloud_id` is missing from the local mock api definition, the `push` command will try to create a new Mock API
in WireMock Cloud before pushing the local Mock API.

If you want to push all the Mock APIs defined in your local WireMock environment file, you can run the `push mock-api`
command without any service ID and specifying the `--all` flag:

```shell  theme={null}
wiremock push mock-api --all
```

<Warning>
  It is important to note that pushing a local Mock API to WireMock Cloud will overwrite the existing Mock API.  This
  means that any stubs added or modified or changes made to the api definition documents (OpenApi document or GraphQL
  schema) will be lost when you push the local Mock API via the CLI.  This feature is to be used with care.
</Warning>

