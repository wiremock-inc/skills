---
name: build-environment
description: Set up mock APIs for all of a project's API dependencies at once, using existing API templates wherever one fits and building a simulation only where none does. Use when the user wants to build, create or set up a mock, test or local environment for a project, app or service in WireMock Cloud or locally.
user-invocable: true
argument-hint: "[cloud|local]"
allowed-tools:
  - Read(../references/*)
  - Bash(wiremock --version)
  - Bash(wiremock templates search:*)
  - Bash(wiremock mock-apis pull:*)
  - "mcp__plugin_wiremock-cloud_wiremock__who_am_i"
  - "mcp__plugin_wiremock-cloud_wiremock__search_api_templates"
  - "mcp__plugin_wiremock-cloud_wiremock__search_my_mock_apis"
  - "mcp__plugin_wiremock-cloud_wiremock__create_mock_api"
  - "mcp__plugin_wiremock-cloud_wiremock__create_environment"
  - "mcp__plugin_wiremock-cloud_wiremock__get_environment"
  - "mcp__plugin_wiremock-cloud_wiremock__list_environments"
  - "mcp__plugin_wiremock-cloud_wiremock__delete_environment"
---

<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

Setting mock APIs up **locally** also requires the WireMock CLI (`wiremock`). This is checked in Step 5, only if the user chooses local.

## What this skill does

It gives a project a working set of mock APIs — one for each external or in-house API the project calls — and tells the user where to point the project at them. API templates are used wherever one exists, because a template is faster and more complete than a simulation built from scratch.

In WireMock Cloud the mock APIs are created together as an **environment**: a named set of mock APIs that is created with one call and later deleted with one call. Each member of an environment becomes a mock API named `<member name> [<environment name>]`.

An API template is referred to by its catalogue and slug: `public/<slug>` for the public catalogue (e.g. `public/stripe`), or `org/<slug>` for the user's own organisation's catalogue (e.g. `org/orders-service`). Always use references exactly as `search_api_templates` returns them.

## Step 1: Check access

Call `who_am_i`. If it fails, tell the user they need to log in to WireMock Cloud and stop.

## Step 2: Find the project's API dependencies

The target is: **$ARGUMENTS** — `cloud` or `local` if the user has already said where they want the mock APIs. It may be empty.

Inspect the project for APIs it calls over HTTP:

- SDK and API client packages in the dependency manifest (`package.json`, `pom.xml`, `build.gradle*`, `requirements.txt`, `go.mod`, `Gemfile` and so on).
- Base URLs and hostnames in configuration and environment files (`.env*`, `application*.yml`, `appsettings*.json`, Helm values and so on).
- Generated API clients, and OpenAPI or protobuf files describing other services.

Produce a list. For each dependency record:

- a name;
- whether it is a third-party API or one of the user's own in-house services;
- where in the project its base URL is configured.

Leave out things that are not HTTP APIs the project calls (databases, message brokers, the project's own API).

Also note whether the project signs users in with **OAuth2 or OpenID Connect**. Signs of this are:

- a login library in the dependency manifest (`next-auth`, `passport` and its strategies, `openid-client`, `oidc-client-ts`, `spring-boot-starter-oauth2-client`, `authlib`, `omniauth` and so on);
- configuration for an issuer, an authorisation, token or JWKS URL, or a client ID and secret;
- a login provider's SDK, or its hostname in configuration (Google, Auth0, Okta, Microsoft Entra and so on).

If it does, record which provider it uses, if you can tell, and where its issuer or endpoint URLs are configured. Do not add the login provider to the list of dependencies yet: Step 4 asks the user about it.

If you find none, say so and ask the user to name the APIs they want mocked.

## Step 3: Search for API templates

For each dependency, call `search_api_templates` with its provider or product name, one dependency per call. For in-house services, search with `catalogue` set to `org` first.

If any dependency has no match, call `search_api_templates` **once** with no query and check the full list before concluding there is no template for it — it may be listed under a different name.

If the project signs users in with OAuth2 or OpenID Connect, also call `search_api_templates` once with `tag` set to `auth`. This lists the login mocks that are available, such as Google and Auth0.

## Step 4: Present the plan and confirm

Show the user a table with one row per dependency: the dependency, the matching template reference (or "none"), and what will happen (create from the template, or build a simulation).

If the user has not already said so, use `AskUserQuestion` to ask whether they want the mock APIs:

- **in WireMock Cloud** — hosted, each with its own URL; or
- **running locally** — on `localhost`, using the WireMock CLI.

If the project signs users in with OAuth2 or OpenID Connect, tell the user that WireMock Cloud has ready-made mocks of several OAuth2 and OpenID Connect login providers, and name the ones the `auth` search returned (for example Google and Auth0). Then use `AskUserQuestion` to ask whether one of them should be used, or none:

- offer each login mock that was found as an option, up to the number of options the question allows. Put the one that matches the project's own provider first and mark it as recommended. If there are more than fit, offer the closest matches and say that the others can be named;
- always offer **None** — the project keeps signing in against its real provider.

Ask this even if the project's provider has no matching mock: any of them can stand in for login during testing, though the project's configuration will then differ more from production. Do not choose for the user.

If the user picks one, add it to the plan as a dependency with that template. If they pick none, leave login out of the plan.

Do not proceed until all of this is clear and the user has confirmed the plan.

## Step 5: Create the mock APIs that have a template

### In WireMock Cloud

If two or more dependencies have a template, create them as one environment. Call `create_environment` **once** with:

- `name`: a name that identifies the project and its purpose, e.g. `<project>-dev`. It must be unique within the organisation.
- `members`: one per matched dependency, each with a `name` (e.g. `stripe`) and `fromTemplate` set to the template's reference. Do not set `type` on a member that has `fromTemplate`.

The call waits until every mock API has been created. From the result, note the environment ID and, for each member, its mock API ID and base URL. Each mock API is created fully populated. Call `get_environment` with the environment ID if you need to read them again.

Do not create a `wiremock.yaml` file.

**If the request is rejected as invalid**, nothing was created. Correct what the error names and call `create_environment` again. If the environment name is already in use, choose another name. `list_environments` shows the environment that has it; do not delete an environment you did not create in this session without asking the user.

**If creation fails**, the mock APIs already created are rolled back, but the environment itself remains with status `FAILED` and keeps its name. Tell the user which member failed and why, call `delete_environment` with the environment ID given in the error, and only then try again with the same name.

**Fall back to one mock API at a time** if the `create_environment` tool is not available, or it reports that environments are not enabled for the account or that the server doesn't support environments yet. Also do this when only one dependency has a template. For each matched dependency, call `create_mock_api` with:

- `fromTemplate`: the template's reference;
- `name`: a name that identifies the project as well as the API, e.g. `<project> - Stripe`, so it doesn't clash with an existing mock API.

Do not set `type`. Note each mock API's base URL. If creation fails because the name is already in use, choose another name and try again.

### Locally

1. Run `wiremock --version`. If the CLI is not installed, tell the user to install it with `npm install -g @wiremock/cli` and to run `wiremock login`, then stop.
2. In the project directory, run a single command with one `--from-template` option per matched dependency:

   ```shell
   wiremock mock-apis pull --from-template=public/stripe --from-template=org/orders-service
   ```

   Each template becomes a service in `.wiremock/wiremock.yaml`, on its own port. The command prints the port of each.
3. If the command reports that a service already exists, tell the user and ask before re-running with `--force`, which overwrites it.

## Step 6: Handle dependencies with no template

For each dependency with no matching template, offer to build a simulation using the `build-api-simulation` skill. Do them one at a time, and accept that the user may decline some or all of them.

The members of an environment cannot be changed after it has been created, so a simulation built here is a standalone mock API, not a member of the environment.

## Step 7: Report

Tell the user, for each dependency:

- where its mock came from: the template reference, a newly built simulation, or skipped;
- its base URL — the mock API's base URL for WireMock Cloud, or `http://localhost:<port>` for local.

For a local setup, remind the user to start the mock APIs with `wiremock run`.

If an environment was created, also tell the user:

- its name and ID, and which mock APIs are members of it;
- that the whole environment can be removed with `delete_environment`, which permanently deletes every member mock API. Only call it when the user asks;
- that a member cannot be deleted or shared on its own: access is granted on the environment, and applies to every member.

Then list the configuration values in the project that need to change to point at the mock APIs, using the locations found in Step 2. Offer to make those changes, but do not make them unless the user asks.

If a login mock was set up, the values to change are the project's issuer or its authorisation, token, user info and JWKS URLs, which now point at the login mock's base URL. Say so, and say that the client ID, client secret and redirect URLs may also need to match what the mock expects.
