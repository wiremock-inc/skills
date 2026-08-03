> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Pushing and Pulling Documents

> How to use the WireMock CLI to push and pull OpenAPI documents and GraphQL schemas to your Mock APIs

Some types of Mock APIs have documents associated with them: REST APIs have an OpenAPI document, and GraphQL APIs have a
GraphQL schema.

The CLI allows you to both pull these documents down to your local machine and push them from your local machine into
the WireMock Cloud Mock API.

In addition it can watch a file on your local machine, pushing it into the WireMock Cloud Mock API every time it
changes.

## Usage

Both pull and push commands accept a document type as the first argument and a Mock API ID as the second:

```shell  theme={null}
wiremock <pull|push> <document-type> <mock-api-id>
```

where `<mock_api_id>` is the ID of the Mock API that should receive the recorded stubs. At present you can get that
value by browsing into a Mock API at [https://app.wiremock.cloud](https://app.wiremock.cloud) and extracting it from the URL - for instance in the URL
`https://app.wiremock.cloud/mock-apis/zwg1l/stubs/1e0d7dc0-06a0-49a2-81a7-f5d6a40bfa3d`, the ID is `zwg1l` so you
should pull its OpenAPI as so:

```shell  theme={null}
wiremock pull open-api zwg1l
```

At present, valid document types are `open-api` and `graphql`. The Mock API should be of the appropriate type (defined
at Mock API creation time).

All the commands have an optional `-f` or `--file` option, specifying the file to either save the document to (for pull)
or send as the document (for push):

```shell  theme={null}
wiremock pull open-api zwg1l --file /tmp/zwg1l-open-api.yaml
wiremock push open-api zwg1l --file /tmp/zwg1l-open-api.yaml
```

If omitted, the document is printed to stdout (for pull) or read from stdin (for push).

### Watching

The `push` commands have an additional `-w` / `--watch` which require the file to be defined with `-f` / `--file`.

It will leave the CLI running and automatically push the file whenever it is saved.

