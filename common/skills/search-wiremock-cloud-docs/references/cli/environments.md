> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Environments with the CLI

> How to create and manage environments using the WireMock CLI

The CLI provides commands for creating and managing environments in WireMock Cloud.

## What is an Environment?

An environment is effectively a set of cloud mock APIs that represent an environment like `dev` or `staging`. Locally,
environments are represented by YAML config files which are overlaid on the base environment file and are activated via
the `--profile` CLI parameter for supported operations.

## Creating an Environment

You can create a new environment using the `environments create` command specifying the profile name.

```shell  theme={null}
wiremock environments create --profile staging
```

Given a base wiremock environment file (`wiremock.yaml`) containing the following:

```yaml  theme={null}
services:
  invoicing-api:
    type: REST
    cloud_id: 1234
    name: "Invoicing API"
    port: 8888
  payment-api:
    type: REST
    cloud_id: 4321
    name: "Payment API"
    port: 9999
```

The above `environments create` command will first check to see if an environment file exists (`wiremock-<profile-name>.yaml`)
for the given profile. If one does not exist, it will create a new mock API in WireMock Cloud for each service defined in
the base environment file.  The type of the new mock API will match the type defined in the base environment file. The
names of those mock APIs will be the same as the service names with the addition of a suffix of `[<profile-name>]`. A new
environment profile file will be created alongside the base environment file - `wiremock-<profile-name>.yaml`.

The contents of the new environment profile file will contain the same list of services with the `cloud_id` of the
new mock APIs created in WireMock Cloud:

```yaml  theme={null}
services:
  invoicing-api:
    cloud_id: <mock-api-id>
  payment-api:
    cloud_id: <mock-api-id>
```

Before creating a new environment profile, the CLI will check to see if any mock APIs exist with the same name as
it will be creating. If there are any mock APIs with the same name, the CLI will not allow the creation of the new
profile file.

## Using an Environment

Using an environment is as simple as specifying the profile name when running any commands that support environments.
Doing so will read the profile file (`wiremock-<profile-name>.yaml`) and overlay it onto the configuration from
`wiremock.yaml`, overriding any matching attributes.

For example, given the following `wiremock.yaml` file:

```yaml  theme={null}
services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    port: 8888
    cloud_id: 1234
    originals:
      default: http://private-endpoint1
  payment-api:
    type: REST
    name: "Payment API"
    port: 9999
    cloud_id: 4321
    originals:
      default: http://private-endpoint2
```

and the following environment `wiremock-staging.yaml` file:

```yaml  theme={null}
services:
  invoicing-api:
    cloud_id: 6789
  payment-api:
    cloud_id: 9876
```

running the command:

```shell  theme={null}
wiremock record-many --profile staging
```

would result in the file `wiremock-staging.yaml` being overlaid onto the main `wiremock.yaml` file and the following
configuration being used:

```yaml  theme={null}
services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    port: 8888
    cloud_id: 6789
    originals:
      default: http://private-endpoint1
  payment-api:
    type: REST
    name: "Payment API"
    port: 9999
    cloud_id: 9876
    originals:
      default: http://private-endpoint2
```

In this instance, any recordings made using the `staging` environment will be imported to the `staging` mock APIs.

### Pulling Mock APIs from an Environment

The CLI provides the ability to [pull mock APIs from WireMock Cloud](/cli/push-pull-mock-api) into your local environment.
The pull mock APIs command also supports environments allowing you to specify the profile parameter to pull from a
specific environment, but the pull command works in a slightly different way when a profile is specified.

When pulling a mock API without specifying a profile, the CLI will pull the mock API from the base environment file and
download any stubs and API definition files to a directory named after the mock API.  The base environment file is updated
to include the information about the mock API (e.g. `cloud_id`, `name`, `path`, etc.).

When pulling a mock API with a profile specified, the CLI will pull the environment mock API but will only pull the data (stubs,
API definition files, etc.) and it will be pulled into the same `path` directory as specified in the base environment file.\
The base environment file will not be updated with the information about the environment mock API, effectively pulling
the mock API content but not the mock API metadata.

This feature supports the ability to manage ongoing changes to sets of mock APIs via a git-based workflow, using
environments and merge requests to control change to mock API configuration in the following way:

1. Your main environment file (`wiremock.yaml`) is checked into source control and defines your `production` environment and mock APIs.
2. You `pull` your production environment into your local environment using the `pull` command.
3. You create a new environment (`development`) using the `environments create` command. This will also create the mock APIs for the new environment.
4. You make changes to the environment mock APIs using WireMock Cloud or using the CLI `record-many` command and specifying the `development` profile.
5. When you are happy with the changes, you `pull` the `development` environment into your local environment using the `pull` command specifying the `development` profile.
   This will update your local environment with the changes from the `development` environment but only overwrite the content of the mock APIs as described above.
6. You create a merge request to merge the changes from the `development` environment into the `production` environment.
7. Your team members review the merge request and approve it.
8. The merge request is merged effectively updating the `production` environment with the changes from the `development`
   environment.

This workflow allows you to manage a version-controlled set of mock APIs where all changes are performed via environments
and git merge requests.

## Restrictions

The following restrictions apply when using environments:

1. The `wiremock-<profile-name>.yaml` file must not exist when creating a new environment.
2. No services can be added or removed via the environment profile file.  The same services with the same service keys
   must be present in the environment profile file as in the base environment file.
3. Certain information cannot be changed via the environment profile file.  The following attributes cannot be changed:
   * `type`

