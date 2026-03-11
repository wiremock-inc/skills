> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Profiles

> Understanding WireMock Runner profiles and their use cases

*This page explains the concept of profiles in WireMock. For practical instructions on creating and using profiles to manage environments, see [Managing Environments](/cli/environments).*

**Profiles** provide a mechanism for applying named configuration overrides to your mock API services. They allow you to maintain a single base configuration while selectively modifying specific aspects for different use cases, contexts, or runtime scenarios.

## What are profiles?

A profile is a named configuration overlay that modifies specific aspects of your base WireMock configuration without duplicating the entire configuration structure.

Each profile is stored in a separate file named `wiremock-<profile-name>.yaml` that sits alongside your base `wiremock.yaml` configuration. When you activate a profile using the `--profile` flag, its configuration merges with and overrides matching values in the base configuration.

This overlay mechanism means you define only what changes, not what stays the same.

## Why profiles exist

Mock API configurations often need to vary depending on context:

* Different target URLs for recording (local, staging, production APIs)
* Different port assignments to avoid conflicts
* Different TLS certificates for security contexts
* Different cloud API IDs for environment isolation
* Different validation modes for testing vs. production use

Without profiles, managing these variations requires either maintaining completely separate configuration files (which leads to duplication and drift) or manually editing configurations when switching contexts (which is error-prone and doesn't scale).

Profiles solve this by treating configuration variance as explicit, minimal, named overrides. This makes the relationships between configurations clear and keeps common elements in one place.

## How profiles work

### Configuration overlay

When you specify a profile, WireMock reads both the base configuration and the profile configuration, then merges them. The profile values override any matching base values while inheriting everything else.

For example, given this base configuration:

```yaml  theme={null}
services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    port: 8888
    cloud_id: prod123
    originals:
      default: https://api.example.com
```

And this `wiremock-staging.yaml` profile:

```yaml  theme={null}
services:
  invoicing-api:
    cloud_id: staging456
    originals:
      default: https://staging-api.example.com
```

Using `--profile staging` produces this effective configuration:

```yaml  theme={null}
services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    port: 8888
    cloud_id: staging456
    originals:
      default: https://staging-api.example.com
```

The profile changed only the `cloud_id` and the `originals.default` URL—everything else came from the base configuration.

### Profile scope

Profiles can override specific service properties, but they maintain structural constraints:

* The same services must exist in both base and profile configurations
* Service structure (service keys/names) cannot change
* The service `type` cannot be overridden
* New services cannot be added via profiles

These constraints ensure that profiles remain true overrides rather than separate, divergent configurations.

### Common profile use cases

**Recording from different sources:** Override the `originals` section to record from different target services—production APIs, staging APIs, or local instances—depending on your current task.

**Port conflict avoidance:** Change port assignments when multiple developers or processes need to run mock services simultaneously on the same machine.

**Security context switching:** Apply different TLS certificates or validation modes depending on whether you're doing local development, integration testing, or simulating production-like behavior.

**API specification variants:** Use different OpenAPI validation modes—`none` for exploratory development, `soft` for testing with warnings, `hard` for strict contract validation.

## Profiles for managing environments

One of the most common uses of profiles is managing environment-specific configurations—development, staging, production, and other deployment contexts where the same logical services need different runtime characteristics.

### Environment isolation with cloud APIs

When working with WireMock Cloud, different environments typically map to different mock API instances. A `staging` profile might override the `cloud_id` field to point to staging-specific mock APIs, while a `production` profile points to production mock APIs. This allows the same local configuration structure to sync with environment-appropriate cloud instances.

For example:

```yaml  theme={null}
# wiremock.yaml (base configuration)
services:
  invoicing-api:
    type: REST
    name: "Invoicing API"
    cloud_id: prod123
    port: 8888
```

```yaml  theme={null}
# wiremock-staging.yaml (staging profile)
services:
  invoicing-api:
    cloud_id: staging456
```

Using `--profile staging` targets the staging cloud API while preserving all other configuration.

### Environment-specific recording sources

Recording often needs environment-specific source URLs. Development might record from localhost, staging from internal services, and production from live APIs:

```yaml  theme={null}
# wiremock.yaml
services:
  payment-api:
    originals:
      default: https://api.production.example.com
```

```yaml  theme={null}
# wiremock-dev.yaml
services:
  payment-api:
    originals:
      default: http://localhost:3000
```

## Learn more

For details on the profile file format and how profile overlays work, see the [wiremock.yaml Reference](/cli/wiremock-yaml-reference#profiles).

For instructions on using profiles to manage WireMock Cloud environments, see [Managing Environments](/cli/environments).

For information on using profiles with Runner, see [Serve Mode](/runner/serve) and [Runner Environment Variables](/runner/environment-variables).

For details on WireMock Runner's architecture and capabilities, see [WireMock Runner](/concepts/runner).

