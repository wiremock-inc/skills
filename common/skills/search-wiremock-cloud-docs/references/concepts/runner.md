> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock Runner

> Understanding how WireMock Runner enables hybrid workflows, local-first development and CI/CD integration

*This page explains concepts behind WireMock Runner. To start using the Runner right away, [follow the instructions here](/runner/overview)*

**WireMock Runner** runs as a service anywhere you want and enables you to record, to sync with Cloud, and to host mock APIs in your own infrastructure while continuing to use WireMock Cloud's management interface and collaboration features as a centralized control plane.

This hybrid mode splits the difference between Cloud-only and fully self-managed, letting you mix the benefits of Cloud with local development workflows and execution in your own private cloud infrastructure.

## What is WireMock Runner?

WireMock Runner is a long-running service packaged as a container that can be run anywhere you can deploy it. It connects to WireMock Cloud for configuration and collaboration, but executes recordngs and runs mock APIs locally in your environment.

This architecture creates a clear separation of concerns:

* The **control plane** (management, UI, collaboration) remains in WireMock Cloud
* The **execution plane** (mock API execution) runs wherever you need it - locally via CLI, in your environments via **WireMock Runner** or in WireMock Cloud.

This is what makes hybrid deployment possible, and it's why **WireMock Runner** is sometimes referred to as "hybrid mode."

## Why WireMock Runner Exists

Traditional API mocking solutions force teams to choose between two extremes:

**Fully cloud-based** approaches offer convenience and collaboration but struggle when APIs live behind firewalls, when teams need fast local feedback loops, or when security policies prohibit external connections.

**Fully self-hosted** approaches provide control and privacy but require significant infrastructure investment, eliminate the benefits of cloud collaboration, and create maintenance overhead.

WireMock Runner was designed to resolve this tension. It enables teams to adopt the workflow that matches their needs rather than adapting their needs to match the tool's constraints.

## How WireMock Runner Works

The Runner operates as a containerized service with two primary modes:

### Record Mode

In record mode, the Runner automatically creates or updates mock APIs by capturing real API traffic. This allows teams to build or refresh mock specifications from actual service behavior, keeping mocks aligned with reality as APIs evolve.

Recording can happen locally during development, in CI/CD during integration tests or deployments, or in any environment where you need to capture API interactions (see [Recording on Kubernetes](/runner/recording-multiple-apis-on-kubernetes) for an example).

### Run Mode

In Run / serve mode, the Runner retrieves mock specifications from WireMock Cloud (or uses already locally stored mock configurations) and serves them locally. Incoming requests are matched against these specifications and responded to according to the stub definitions—all without the request ever leaving your infrastructure.

This enables development, testing, and even production-like environments to operate with simulated APIs while remaining completely isolated from external networks.

### Mode Switching

The Runner can be switched between modes dynamically via its HTTP management interface. This allows the same Runner instance to record new interactions during certain workflows and serve those interactions during others—orchestrated by your existing automation.

## Using WireMock Runner

### Git and CI/CD Integration

Mock specifications can live in version control alongside the code they support. WireMock Runner can pull the latest mocks at the start of a CI run, record new interactions during tests, and push updated specifications back to Git—all automated within your existing CI/CD pipeline.

This treats mocks as first-class artifacts: versioned, reviewed through pull requests, and promoted through environments just like application code. See [Promoting APIs with Git and CI/CD](/runner/promoting-apis-with-git-and-ci) for a detailed workflow guide.

### Environment-Specific Configuration

Different environments often require different mock behavior. WireMock Runner supports environment-specific profiles, allowing you to maintain variations for local development, CI, staging, and production-like environments—all in the same repository, all promoted through the same workflow.

### Multi-Location Deployment

Because Runner is a container, it can be deployed anywhere:

* On a developer's laptop for fast local iteration
* Inside a CI pipeline for automated testing
* In a Kubernetes cluster behind the firewall for team environments (see [Running on Kubernetes](/runner/running-on-kubernetes))
* In multiple regions or data centers for distributed teams

All of these instances connect to the same WireMock Cloud control plane for management and collaboration, while serving mocks locally in each environment.

## When to Use WireMock Runner

WireMock Runner is particularly valuable when:

### APIs Are Not Publicly Accessible

If the APIs you need to simulate live behind corporate firewalls, VPNs, or in regulated environments with strict network controls, cloud-only mocking won't work. Runner brings mock execution into your network while keeping management tools accessible.

### Fast Feedback Loops Matter

Local development benefits from tight feedback loops. Depending on cloud-hosted mocks adds network latency and potential connectivity issues. Running mocks locally with Runner eliminates these dependencies and speeds up the development cycle.

### CI/CD Cannot Access External Services

Many CI environments operate in isolated networks without internet access. Runner can be packaged into these environments, allowing CI pipelines to use sophisticated API simulation without requiring external connectivity.

### Configuration as Code (or Gitflow) Is Required

Teams practicing GitOps or infrastructure-as-code need their tooling to fit that model. Runner's integration with version control and CI/CD makes mock management programmable and auditable, rather than manual and UI-driven.

### Security Policies Restrict Data Movement

Some organizations cannot allow request/response data to transit to external services, even temporarily. Runner processes all mock traffic locally, sending only metadata and specifications to the cloud for management purposes.

## Relation to WireMock CLI

WireMock CLI and WireMock Runner share the same underlying implementation but are packaged separately. The CLI is optimized for interactive, short-lived operations—typically for individual developers working on single machines. WireMock Runner is optimized for long-lived, service-based operation.

Most developers will use the CLI for day-to-day work and encounter Runner when their mocks are deployed to shared environments or when their CI/CD pipelines execute tests against simulated APIs.

## Learn More

For details on installing and running WireMock Runner, see the [WireMock Runner documentation](/runner/overview).

For a comparison of deployment modes and their trade-offs, see [Deployment](/concepts/deployment).

For practical examples of how Runner can be used in a real-world software delivery workflow, see:

* [Running on Kubernetes](/runner/running-on-kubernetes)
* [Recording on Kubernetes](/runner/recording-multiple-apis-on-kubernetes)
* [Promoting APIs with Git and CI/CD](/runner/promoting-apis-with-git-and-ci)

