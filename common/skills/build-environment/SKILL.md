---
name: build-environment
description: Set up mock APIs for all of a project's API dependencies at once, using existing API templates wherever one fits and building a simulation only where none does, then run the project's integration tests against them and fix the mocks until they pass. Use when the user wants to build, create or set up a mock, test or local environment for a project, app or service in WireMock Cloud or locally.
user-invocable: true
argument-hint: "[cloud|local]"
allowed-tools:
  - Read(../references/*)
  - Bash(wiremock --version)
  - Bash(wiremock templates search:*)
  - Bash(wiremock mock-apis pull:*)
  - "{{WIREMOCK_TOOL_PREFIX}}who_am_i"
  - "{{WIREMOCK_TOOL_PREFIX}}search_api_templates"
  - "{{WIREMOCK_TOOL_PREFIX}}search_my_mock_apis"
  - "{{WIREMOCK_TOOL_PREFIX}}create_environment"
  - "{{WIREMOCK_TOOL_PREFIX}}get_environment"
  - "{{WIREMOCK_TOOL_PREFIX}}list_environments"
  - "{{WIREMOCK_TOOL_PREFIX}}delete_environment"
  - "{{WIREMOCK_TOOL_PREFIX}}search_stub_mappings"
  - "{{WIREMOCK_TOOL_PREFIX}}import_stubs_to_mock_api"
  - "{{WIREMOCK_TOOL_PREFIX}}update_stub_mapping"
  - "{{WIREMOCK_TOOL_PREFIX}}search_request_journal"
  - "{{WIREMOCK_TOOL_PREFIX}}reset_request_journal"
  - "{{WIREMOCK_TOOL_PREFIX}}reset_state"
  - "{{WIREMOCK_TOOL_PREFIX}}get_mock_api_settings"
  - "{{WIREMOCK_TOOL_PREFIX}}update_mock_api_settings"
  - "{{WIREMOCK_TOOL_PREFIX}}list_data_sources"
  - "{{WIREMOCK_TOOL_PREFIX}}get_data_source_data"
  - "{{WIREMOCK_TOOL_PREFIX}}update_data_source_data"
---

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

Setting mock APIs up **locally** also requires the WireMock CLI (`wiremock`). This is checked in Step 5, only if the user chooses local.

## What this skill does

It gives a project a working set of mock APIs — one for each external or in-house API the project calls — and tells the user where to point the project at them. It then runs the project's own integration tests against the mock APIs and adjusts the mocks until the tests pass. API templates are used wherever one exists, because a template is faster and more complete than a simulation built from scratch.

In WireMock Cloud the mock APIs are always created together as an **environment**: a named set of mock APIs that is created with one call and later deleted with one call. Every mock API this skill creates is a member of it, whether it comes from a template or is built as a simulation, and however many there are. This skill never creates a standalone mock API in WireMock Cloud, and never offers to. Each member of an environment becomes a mock API named `<member name> [<environment name>]`.

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

If any dependency has no template, ask the user which of those should have a simulation built. Settle this now: the members of an environment cannot be changed after it has been created, so every mock API has to be part of it from the start. Leave a dependency the user does not want mocked out of the plan.

If the user has not already said so, use `AskUserQuestion` to ask whether they want the mock APIs:

- **in WireMock Cloud** — hosted, each with its own URL; or
- **running locally** — on `localhost`, using the WireMock CLI.

If the project signs users in with OAuth2 or OpenID Connect, tell the user that WireMock Cloud has ready-made mocks of several OAuth2 and OpenID Connect login providers, and name the ones the `auth` search returned (for example Google and Auth0). Then use `AskUserQuestion` to ask whether one of them should be used, or none:

- offer each login mock that was found as an option, up to the number of options the question allows. Put the one that matches the project's own provider first and mark it as recommended. If there are more than fit, offer the closest matches and say that the others can be named;
- always offer **None** — the project keeps signing in against its real provider.

Ask this even if the project's provider has no matching mock: any of them can stand in for login during testing, though the project's configuration will then differ more from production. Do not choose for the user.

If the user picks one, add it to the plan as a dependency with that template. If they pick none, leave login out of the plan.

Do not proceed until all of this is clear and the user has confirmed the plan.

## Step 5: Create the mock APIs

### In WireMock Cloud

Always create one environment that holds every mock API in the plan. Do this whether the plan has one mock API or many, and whether they come from templates, are to be built as simulations, or are a mix of the two. Call `create_environment` **once** with:

- `name`: a name that identifies the project and its purpose, e.g. `<project>-dev`. It must be unique within the organisation.
- `members`: one per dependency in the plan, each with a `name` (e.g. `stripe`) and:
  - for a dependency that has a template, `fromTemplate` set to the template's reference. Do not set `type` on a member that has `fromTemplate`;
  - for a dependency that will have a simulation built, `type` set to `openapi`. This creates a blank mock API, which Step 6 fills in.

The call waits until every mock API has been created. From the result, note the environment ID and, for each member, its mock API ID and base URL. A member created from a template is fully populated; a member created with `type` is blank. Call `get_environment` with the environment ID if you need to read them again.

Do not create a `wiremock.yaml` file.

**If the request is rejected as invalid**, nothing was created. Correct what the error names and call `create_environment` again. If the environment name is already in use, choose another name. `list_environments` shows the environment that has it; do not delete an environment you did not create in this session without asking the user.

**If creation fails**, the mock APIs already created are rolled back, but the environment itself remains with status `FAILED` and keeps its name. Tell the user which member failed and why, call `delete_environment` with the environment ID given in the error, and only then try again with the same name.

**If environments are not available** — the `create_environment` tool is missing, or it reports that environments are not enabled for the account or that the server doesn't support environments yet — tell the user that this is why the mock APIs cannot be created in WireMock Cloud, and stop. Do not create the mock APIs one at a time with `create_mock_api` instead, and do not offer to.

### Locally

1. Run `wiremock --version`. If the CLI is not installed, tell the user to install it with `npm install -g @wiremock/cli` and to run `wiremock login`, then stop.
2. In the project directory, run a single command with one `--from-template` option per matched dependency:

   ```shell
   wiremock mock-apis pull --from-template=public/stripe --from-template=org/orders-service
   ```

   Each template becomes a service in `.wiremock/wiremock.yaml`, on its own port. The command prints the port of each.
3. If the command reports that a service already exists, tell the user and ask before re-running with `--force`, which overwrites it.

## Step 6: Build the simulations

For each dependency in the plan that has no template, build a simulation using the `build-api-simulation` skill. Do them one at a time.

In WireMock Cloud, the mock API for each simulation already exists as a blank member of the environment. Tell `build-api-simulation` to build into that mock API, giving it the member's mock API ID, so that it does not create another one. Never create a standalone mock API for a simulation.

Ask the user everything `build-api-simulation` would ask if they had run it directly, for each simulation: whether the API already exists, and then the project folder, sandbox, authenticators, info locations, statefulness and other directives, or the description of the API, as that skill sets out. Do not skip a question, answer it yourself, or assume a default because the skill is being run from here. The only things carried over are the ones this skill has already settled: the name of the API, that no template is to be used, and the mock API to build into.

If the user decides against a simulation at this point, its blank member stays in the environment. Say so in the report.

## Step 7: Run the project's tests against the mock APIs

Look in the project for tests that exercise it together with the APIs it calls:

- integration, end-to-end, contract or API test suites, and the scripts, build tasks or CI steps that run them;
- equivalents that are not code, such as Postman collections (run with `newman`), Bruno or Insomnia collections, `.http` request files, and k6 or similar scripts.

Leave out unit tests that replace the APIs with in-process fakes: they never call the mock APIs, so they show nothing here.

If you find none, say so in the report and go on to Step 8. If it is not clear which tests are meant to run this way, or how to run them, ask the user.

### Point the tests at the mock APIs

The tests have to call the mock APIs and not the real ones. Do this for the test run only, without changing files in the project where you can: set environment variables, pass options on the command line, or use a Postman environment file kept outside the project. If the only way is to change a file in the project, ask the user first.

Before running, check that nothing still points at a real API. Do not run tests that would write to a real, live service.

For a local setup, start the mock APIs with `wiremock run` in the background first, and stop them when you have finished.

### Run them and fix the mocks

Run the tests. For each failure, work out whether the cause is the mock APIs or something else. In WireMock Cloud, call `search_request_journal` on the mock API concerned to see the requests it received and which of them matched no stub. Call `reset_request_journal` before a run to keep the results easy to read.

When a failure is caused by a mock API — a stub is missing or does not match the request, a response lacks a field or holds data the test does not expect, state is not carried from one request to the next, or a setting such as request validation rejects a valid request — change the mock API so that the test passes:

- in WireMock Cloud, add or correct stubs with `import_stubs_to_mock_api` and `update_stub_mapping`, correct data with `update_data_source_data`, and correct settings with `update_mock_api_settings`. Follow the [Stub Creation Guidelines](../references/stub-creation.md) and [Validating and Fixing Stubs](../references/validating-and-fixing.md);
- locally, edit the files of the service under `.wiremock/`, then restart `wiremock run`.

Make the mock API behave as the real API does, as far as you can tell from its documentation and from what the test expects. Do not add a stub that answers anything at all just to turn a test green. Change only what the failing test needs, and leave stubs that other tests rely on working.

Run the tests again after each round of changes, and repeat until they pass or you stop making progress. Stop and tell the user if the same failures remain after a few rounds.

### Do not change the tests

Do not modify the tests, their fixtures or their expected results, and do not skip or disable a test, to make the run pass. The same goes for the project's own code.

If you believe a test cannot pass without being changed — for example it depends on something only the real API can do, it asserts on a value fixed in the real service's data, or it looks wrong in itself — stop and discuss it with the user. Explain what the test expects, why the mock APIs cannot meet it, and what change you would propose. Change it only if the user agrees.

A failure that has nothing to do with the mock APIs, such as a test that also fails against the real services or a missing database, is not yours to fix here. Report it.

## Step 8: Report

If tests were run in Step 7, start with the result: which tests were run and how, how many passed and failed, every change made to a mock API and why, and any failure that remains with its cause.

Tell the user, for each dependency:

- where its mock came from: the template reference, a newly built simulation, left blank, or skipped;
- its base URL — the mock API's base URL for WireMock Cloud, or `http://localhost:<port>` for local.

For a local setup, remind the user to start the mock APIs with `wiremock run`.

If an environment was created, also tell the user:

- its name and ID, and which mock APIs are members of it;
- that the whole environment can be removed with `delete_environment`, which permanently deletes every member mock API. Only call it when the user asks;
- that a member cannot be deleted or shared on its own: access is granted on the environment, and applies to every member.

Then list the configuration values in the project that need to change to point at the mock APIs, using the locations found in Step 2. Offer to make those changes, but do not make them unless the user asks.

If a login mock was set up, the values to change are the project's issuer or its authorisation, token, user info and JWKS URLs, which now point at the login mock's base URL. Say so, and say that the client ID, client secret and redirect URLs may also need to match what the mock expects.
