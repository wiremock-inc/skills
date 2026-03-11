> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Recording from Within Kubernetes

> How to record new stub mappings using WireMock Runner deployed in Kubernetes

This guide shows you how to record additional API endpoints into your WireMock Cloud mock APIs using the WireMock Runner deployed in a Kubernetes cluster. You'll use the Runner's [Record Many Mode](/runner/record-many) to capture real HTTP traffic and automatically create stub mappings.

## Prerequisites

Before you begin, ensure you have:

* Completed the [Running on Kubernetes](/runner/running-on-kubernetes) guide
* WireMock Runner deployed and running in your Kubernetes cluster
* WireMock CLI installed and authenticated
* Access to the services you want to record (either real APIs or test environments)

## Set up a development environment

Next we'll set up a development environment in WireMock Cloud (an environment is a set of mock APIs intended to be used together).

### Initialise environment and profile

Run the following to create a new environment in WireMock Cloud and also create a new profile,
which will be defined in `wiremock-development.yaml` and maps the local services to the corresponding cloud IDs for the APIs we just created:

```bash  theme={null}
wiremock environments create --profile development
```

Note the base URLs of the mock APIs from the output - you'll need these to test your recorded endpoints in WireMock Cloud.

### Push existing stubs

If you have existing stub mappings in your local `.wiremock` directory, push them to your development environment:

```bash  theme={null}
wiremock push mock-api --all --profile development
```

This ensures your development environment starts with the same baseline as your production environment.

### Set the profile in the Runner

When the Runner starts we need to set it to use the profile we just created,
so add the following to the `wiremock-runner` container environment variables in the Kubernetes manifest in `wiremock-runner.yaml`:

```yaml  theme={null}
- name: WMC_RUN_PROFILE
  value: "development"
- name: WMC_RECORD_MANY_PROFILE
  value: "development"
```

Apply the changes to the Kubernetes cluster:

```bash  theme={null}
./install-wiremock.sh
```

## Start Recording

Switch the Runner to record-many mode using the Runner's admin API:

```bash  theme={null}
curl -X PUT \
  -d '{ "mode": "record-many" }' \
  http://admin.local.wiremock.cloud/v1/mode
```

The Runner is now proxying requests to the real APIs defined in your `.wiremock/wiremock.yaml` file and recording the responses.

## Make requests to record

Make requests to the API endpoints you want to record. The Runner will forward these to the real API and capture both the request and response.

For example, to record a GitHub organizations endpoint:

```bash  theme={null}
curl -v http://github.local.wiremock.cloud/organizations
```

You should see the real response from GitHub, and the Runner will automatically create a stub mapping for this endpoint.

Continue making requests to capture all the endpoints you need.

## Flush recorded stubs

Flush the recorded stubs to ensure they're saved to WireMock Cloud:

```bash  theme={null}
curl -X POST http://admin.local.wiremock.cloud/v1/record-many/flush
```

<Warning>
  Always flush before stopping recording or switching modes. The Runner does not automatically flush when switching modes, so any unflushed recordings will be lost.
</Warning>

## Stop recording

Switch the Runner back to serve mode:

```bash  theme={null}
curl -X PUT \
  -d '{ "mode": "serve" }' \
  http://admin.local.wiremock.cloud/v1/mode
```

## Test your recorded stubs

### Test in WireMock Cloud

Use the base URLs you noted earlier to test the recorded endpoints directly in WireMock Cloud:

```bash  theme={null}
curl https://your-development-api.wiremock.cloud/organizations
```

You should see the recorded response without any request being made to the real GitHub API.

You should also see the recorded stubs in the WireMock Cloud UI under the Stubs tab for the GitHub API.

### Pull changes to your local environment

Pull the newly recorded stubs down into the local project:

```bash  theme={null}
wiremock pull mock-api --all --profile development
```

This downloads the stub mappings and OpenAPI from the development instance of the GitHub API in Cloud to the local project.

Now redeploy to the local Kubernetes cluster:

```bash  theme={null}
./install-wiremock.sh
```

### Test in Kubernetes

Test the recorded endpoints again to ensure they're working correctly:

```bash  theme={null}
curl -v http://github.local.wiremock.cloud/organizations
```

You should see the recorded response without any request being made to the real GitHub API.

## Next steps

* Learn how to [promote your mock APIs between environments](/runner/promoting-apis-with-git-and-ci) using Git and CI/CD.

## Additional resources

* Explore [selective recording](/runner/record-many#choosing-which-services-to-record) to record only specific services
* Configure [batching options](/cli/recording#importing-recordings-as-you-go-along) to control when recordings are flushed

