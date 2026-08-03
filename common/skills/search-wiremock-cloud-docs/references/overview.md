> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview of API simulation with WireMock Cloud

> Get started with WireMock Cloud.

WireMock Cloud is a platform for rapidly building stateful, high quality simulations of production services that run as easy to use mock APIs.

You can use these simulated services locally, in dev environments and in test environments to replace production API dependencies that slow you down and cost you money.

If you're new to WireMock Cloud or API virtualization, we recommend:

* [Reading our product overview page](https://www.wiremock.io/cloud-overview)
* [Watching the WireMock Cloud Academy on YouTube](https://www.youtube.com/playlist?list=PL4V1b_lhwTrWf10Q0BUepsBqn4fMZ3q4u)
* [Learn about our plans and pricing](https://www.wiremock.io/get-pricing)

WireMock Cloud supports SOAP, REST, OpenAPI, GRPC and GraphQL.

## Platform Overview

WireMock Cloud's platform provides a number of Enterprise-grade features that you can learn more about in the documentation here.

* Easily design, import or record any new virtualized API
* Team management with SSO and RBAC
* Activity logging to monitor service usage
* Use Git as a source of truth for API specs
* Inject fault, Chaos and other forms of rainy day behavior
* Create synthetic test data or import data from a CSV or database

## API Creation

WireMock Cloud provides a number of ways to set up a mock API:

* Manually via the web app
* OpenAPI, Swagger, Postman or HAR import
* Record traffic to and from another API
* Import an existing project from WireMock OSS
* Automate via WireMock's own REST APIs

## Getting Started

### Create Account

To get started, [first create your free account](https://app.wiremock.cloud/login?for=signup). You'll have 30 days of unlimited Enterprise features, after which you'll revert to our forever free plan. [Learn more about our plans and pricing here.](https://www.wiremock.io/get-pricing)

### Creating Your First Simulated API

#### Manually

Creating stubs manually in the web UI is often the simplest way forward if:

* The API you're mocking is quite simple (or you only need a small part of it)
* You're working from a specification document and you want to copy/paste examples into a running simulation
* You just want to quickly explore what WireMock Cloud can do

More details on manual creation can be found in the [Stubbing](./stubbing/) and [Advanced stubbing](./advanced-stubbing/) articles.

#### Swagger and OpenAPI import

If you already have a Swagger or OpenAPI specification, you can import it and WireMock Cloud will auto-generate a set of stubs.

Swaggerhub users can integrate with WireMock Cloud via a webhook, so that the mock API
will be updated each time a change is saved.

See [Swagger Import](/openAPI/swagger/) for details.

#### Record An API

If you want to create a mock of an existing API which is accessible over the internet,
you can configure WireMock Cloud to proxy (forward) traffic to it and record requests as stubs.

See [Recording Stubs](./recording-stubs/) for details.

#### Importing from WireMock OSS

WireMock Cloud uses WireMock OSS as its underlying engine, so mock APIs created within WireMock
can be directly imported into WireMock Cloud (and vice versa).

This can be useful when you need to record APIs that are only accessible inside your
organisation or from a private network, or if you have existing projects utilising
WireMock that you'd like to host in the cloud.

See [import and export](./import-export/) for details.

### Next Steps

After creating your first API, we recommend diving into the [WireMock Cloud Academy](https://www.youtube.com/playlist?list=PL4V1b_lhwTrWf10Q0BUepsBqn4fMZ3q4u) to learn all the possible ways of building and consuming your new mock API.

You can also hit **command+K** to use our AI-powered documentation search and ask any question you want (example: *"How do I add a data source?"*).

You can also [contact us](mailto:support@wiremock.io) anytime you want to ask a question!

