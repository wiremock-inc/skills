<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Syncing API Templates with the CLI

> How to sync local API templates into your organisation's template catalogue using the WireMock CLI

The CLI provides a command for syncing API templates from your local environment into your organisation's template catalogue in WireMock Cloud.

## What is an API Template?

An API template is a reusable mock API definition that can be added to your organisation's catalogue, ready to be
instantiated as a mock API in WireMock Cloud. A template is made up of:

* A set of stub mappings, plus an OpenAPI document for `REST` type templates
* Metadata such as a name, description, tags and an optional logo

## Syncing Templates

You can sync templates using:

```shell theme={null}
wiremock templates sync [<options>]
```

Templates are read from one or more `.wiremock` directories, with one template generated per service defined in the
directory's `wiremock.yaml`. For each service, the CLI looks for:

* `openapi.yaml` - the OpenAPI document for the service (required for `REST` type services)
* `stub-mappings.yaml` - the stub mappings for the service; if omitted, the template is synced with no stub mappings
* `logo.png`, `logo.svg`, `logo.jpg`, `logo.jpeg`, `logo.gif`, or `logo.webp` - a logo for the template (optional)

These files are expected under the service's directory, which defaults to a directory named after the service key
but can be overridden using the `path` attribute on the service in `wiremock.yaml`. The template's slug defaults to
the service key but can be overridden using a `slug` attribute on the service. The template's name, description, and
tags are taken from the corresponding attributes on the service.

<Info>
  Only services of type `REST` and `Unstructured` can be synced as templates. `GraphQL` and `gRPC` services are not yet supported.
</Info>

### Options

* `--wiremock-dir=<path>` - A `.wiremock` directory to sync templates from; may be specified multiple times (default: `.wiremock`)
* `--dry-run` - Print what would be synced without making any changes
* `--prune` / `--no-prune` - Remove remote templates not present locally; use `--no-prune` to only report them instead (default: `--prune`)
* `-f, --force` - Skip the confirmation prompt when pruning (only valid with `--prune`)

### Examples

Sync templates from the default `.wiremock` directory:

```shell theme={null}
wiremock templates sync
```

```text theme={null}
Syncing templates from /path/to/.wiremock...
Created template 'Payments API' (payments-api)
Unchanged template 'Orders API' (orders-api)
2 of 2 template(s) synced
```

Sync templates from multiple directories:

```shell theme={null}
wiremock templates sync --wiremock-dir=./service-a/.wiremock --wiremock-dir=./service-b/.wiremock
```

Preview changes without syncing:

```shell theme={null}
wiremock templates sync --dry-run
```

```text theme={null}
Syncing templates from /path/to/.wiremock...
Unchanged template 'Payments API' (payments-api)
Would create template 'Invoices API' (invoices-api)
Would update template 'Users API' (users-api)
2 of 3 template(s) would be synced
```

## Pruning removed templates

By default, `templates sync` removes any templates from the catalogue that no longer have a corresponding local
service. Before deleting anything, it lists the templates it intends to remove and asks for confirmation:

```text theme={null}
This will delete 1 remote template(s) not present locally: 'stale-api'. Are you sure you want to continue? [y/n]:
```

Use `--force` to skip this confirmation prompt, or `--no-prune` to only report the remote-only templates without
deleting them:

```shell theme={null}
wiremock templates sync --force
wiremock templates sync --no-prune
```

## See also

* [CLI command reference](/cli/command-reference)
