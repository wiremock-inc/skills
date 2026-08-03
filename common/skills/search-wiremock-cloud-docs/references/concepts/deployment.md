> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Deployment

> Understanding the different ways to deploy WireMock

## Deployment Modes

WireMock can be deployed in three distinct modes, each suited to different organizational needs and constraints:

1. **Cloud** - Fully managed hosting
2. **Self-hosted** - Complete on-premises deployment
3. **Hybrid** - Control plane in the cloud, data plane on-premises

## Cloud Deployment

With Cloud deployment, WireMock hosts everything for you:

* **Control plane** - The management interface and API
* **Data plane** - The mock API endpoints that respond to requests
* **User interface** - The web-based UI for managing your simulations

All components are accessible from the internet with nothing to install or maintain. This mode provides:

* Immediate availability with no infrastructure setup
* Automatic updates and maintenance
* Built-in scalability and high availability
* Public accessibility for remote teams and external integrations

Cloud deployment is ideal for:

* Quick prototyping and experimentation
* Teams without dedicated infrastructure
* Scenarios where public internet accessibility is acceptable
* Organizations wanting zero operational overhead

## Self-Hosted Deployment

Self-hosted deployment involves running the entire WireMock product stack on your own Kubernetes cluster.

This mode requires you to:

* Provide and manage a Kubernetes cluster
* Provide and manage a Postgres database
* Handle installation, updates, and maintenance
* Configure networking, DNS, certificates and security
* Monitor and scale infrastructure as needed

Self-hosted deployment offers:

* Complete control over data and infrastructure
* Ability to keep all traffic within private networks
* Customization of deployment topology
* Compliance with strict data residency requirements

This mode is appropriate for:

* Organizations with security policies prohibiting cloud services
* Scenarios requiring air-gapped or isolated network environments
* Teams with existing Kubernetes expertise and infrastructure
* Situations demanding complete data sovereignty

## Hybrid Deployment

[Hybrid deployment](/concepts/runner) balances convenience with control by splitting the architecture:
the control plane an UI remain in the cloud while API simulations are hosted in your infrastructure
using WireMock Runner.

Benefits of hybrid deployment:

* Simplified management through the cloud-hosted UI
* Data plane traffic stays within your network
* Flexibility to deploy mock APIs where they're needed
* Reduced operational burden compared to full self-hosting

Hybrid deployment suits:

* Development and testing workflows requiring local or private simulated APIs
* CI/CD pipelines that can't access public internet services
* Organizations comfortable with cloud management but requiring private data planes
* Scenarios needing simulated APIs in multiple diverse locations

