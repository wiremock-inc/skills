> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Running the WireMock Runner on Kubernetes

> How to deploy and run WireMock Runner in a Kubernetes cluster

This guide shows you how to deploy the WireMock Runner in a Kubernetes cluster, configured to serve mock APIs from WireMock Cloud.

## Prerequisites

Before you begin, ensure you have:

* A Kubernetes cluster (local or remote)
  * For local development, [KIND](https://kind.sigs.k8s.io/) is recommended
* `kubectl` CLI tool installed and configured
* WireMock CLI installed and configured
  * Install from the [WireMock CLI documentation](/cli/overview)
  * Authenticate with `wiremock login` or configure your API token with `wiremock config set api-token <your-token>`
* A WireMock Cloud account with one or more mock APIs created

## Clone the demo repository

The WireMock Kubernetes Runner demo repository contains all the necessary configuration files and scripts:

```bash  theme={null}
git clone https://github.com/wiremock-inc/kubernetes-runner-demo.git
cd kubernetes-runner-demo
```

## Create a cluster

Run the following script:

```bash  theme={null}
./create-cluster.sh
```

This will create a local KIND cluster using `kind.config.yaml` for configuration. Ingress will be configured to listen
on HTTP port 80 and HTTPS port 443.

If you're using a remote cluster, you can skip this step.

## Set up authentication

Create a Kubernetes secret with your WireMock Cloud API token:

```bash  theme={null}
./set-secret.sh
```

This script retrieves your API token from the WireMock CLI configuration and creates a secret named `wiremock-cloud-token` that the WireMock Runner will use to authenticate with WireMock Cloud.

<Note>
  If you haven't logged in with the WireMock CLI, run `wiremock login` first. You can also find your API token in the [WireMock Cloud console](https://app.wiremock.cloud/account/security).
</Note>

## Deploy to Kubernetes

Run the installation script to deploy WireMock Runner:

```bash  theme={null}
./install-wiremock.sh
```

This script will do the following by applying the manifest in `wiremock-runner.yaml`:

1. Create a Persistent Volume Claim (PVC) for storing WireMock configuration
2. Deploy the WireMock Runner service and deployment
3. Set up ingress rules for accessing the APIs

The demo project includes pre-recorded stub mappings under `.wiremock` directory for both the PayPal Invoicing and GitHub REST APIs, so you can test the deployment immediately without needing to create stubs first.

Verify the deployment:

```bash  theme={null}
kubectl get pods -l app=wiremock-runner
```

You should see the WireMock Runner pod in a `Running` state.

## Monitor your deployment

### Check pod status

```bash  theme={null}
kubectl get pods -l app=wiremock-runner
```

### View logs

```bash  theme={null}
kubectl logs -l app=wiremock-runner -f
```

## Test the APIs

<Note>
  For local development, you may need to add these entries to your hosts file:

  ```
  127.0.0.1 admin.local.wiremock.cloud paypal.local.wiremock.cloud github.local.wiremock.cloud
  ```
</Note>

First, try fetching a list of PayPal invoices from the simulated PayPal Invoicing API:

```bash  theme={null}
curl 'http://paypal.local.wiremock.cloud/v2/invoicing/invoices?page=1&page_size=10&total_required=true&fields=amount'
```

You should see a fairly large JSON response, containing invoice data.

Now try fetching a list of GitHub users from the simulated GitHub REST API:

```bash  theme={null}
curl http://github.local.wiremock.cloud/users
```

Again, you should see a JSON response, containing a list of user profiles.

## Clean up

To remove the WireMock Runner deployment:

```bash  theme={null}
./delete-wiremock.sh
```

To delete the KIND cluster (if using a local cluster):

```bash  theme={null}
kind delete cluster --name wiremock-demo
```

## Next steps

* Learn how to [record multiple APIs simultaneously](/runner/recording-multiple-apis-on-kubernetes) from within Kubernetes
* Learn how to [promote your mock APIs between environments](/runner/promoting-apis-with-git-and-ci) using Git and CI/CD.

## Additional resources

* Learn more about [Serve Mode](/runner/serve) configuration options
* Explore the [Runner Overview](/runner/overview) for other modes

