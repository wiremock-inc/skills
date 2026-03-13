> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Import & Export - Via the API

> Automating import and export of mock API stubs via WireMock Cloud's API.

A mock API's stubs can be exported in bulk via the admin API. This can be useful for backing
up your API to source control, or cloning the contents of one API into another.

## Importing

To import any of the supported formats (Swagger, OpenAPI, WireMock Cloud WireMock JSON),
execute a `POST` request to the stub import URL e.g.:

```bash  theme={null}
curl -v \
  --data-binary @my-swagger-spec.yaml \
  -H 'Authorization:Token my-api-token' \
  https://my-api.wiremockapi.cloud/__admin/ext/imports
```

More detail can be found in our [API reference](../api-reference/imports/import-into-a-mock-api).

## Exporting in WireMock Cloud/WireMock JSON format

To export an API's stubs, execute a `GET` request to the stub mappings admin URL e.g.:

```bash  theme={null}
curl --output my-stubs.json \
  -H 'Authorization:Token my-api-token' \
  https://my-api.wiremockapi.cloud/__admin/mappings
```

You can find your API token at [https://app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security).

