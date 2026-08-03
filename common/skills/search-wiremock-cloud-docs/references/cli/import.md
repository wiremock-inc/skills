> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Importing into WireMock Cloud

> How to use the WireMock CLI to import stubs from WireMock OSS, HAR files, Postman collections, and OpenAPI/Swagger specifications

The WireMock CLI provides an `import` command that allows you to import stub mappings into WireMock Cloud from multiple sources:

* **WireMock OSS** projects (stub mapping JSON files)
* **HAR (HTTP Archive)** files captured from browser developer tools or proxy tools
* **Postman** collections
* **OpenAPI/Swagger** specifications

This is useful when migrating from other tools to WireMock Cloud, reusing existing API definitions, or converting recorded traffic into mock stubs.

## Basic Usage

To import stubs from a file or directory, use the following command:

```shell  theme={null}
wiremock import <file_or_directory> --to=<mock-api-id>
```

where:

* `<file_or_directory>` is the path to file for import, or a WireMock project directory
* `<mock-api-id>` is the ID of the Mock API in WireMock Cloud that should receive the imported stubs

### Getting the Mock API ID

You can get the Mock API ID by browsing to your Mock API at [https://app.wiremock.cloud](https://app.wiremock.cloud) and extracting it from the URL. For instance, in the URL `https://app.wiremock.cloud/mock-apis/33eye3l9/stubs/1e0d7dc0-06a0-49a2-81a7-f5d6a40bfa3d`, the ID is `33eye3l9`.

## Supported Import Formats

The import command automatically detects the format of the input file or directory and processes it accordingly.

### WireMock OSS Format

WireMock OSS stub mappings are JSON files that define request matchers and responses.

#### Importing from a WireMock OSS Project Directory

When importing from a WireMock OSS project, you should specify the **parent directory** that contains the `mappings` and `__files` subdirectories, not the `mappings` directory itself.

For example, if you have a typical WireMock OSS project structure:

```
my-wiremock-project/
├── mappings/
│   ├── get-users.json
│   ├── post-user.json
│   └── delete-user.json
└── __files/
    └── users-response.json
```

You should import by pointing to the parent directory:

```shell  theme={null}
wiremock import ./my-wiremock-project --to=33eye3l9
```

The CLI will automatically look for the `mappings` subdirectory within the specified path and import all stub mappings found there. If your stubs reference files in the `__files` directory (for body files), those will also be imported correctly.

#### Importing a Single WireMock Stub File

To import a single stub mapping file:

```shell  theme={null}
wiremock import my-stub.json --to=33eye3l9
```

### HAR (HTTP Archive) Format

HAR files are JSON files that contain recorded HTTP traffic, typically captured from browser developer tools or HTTP proxy tools like Charles Proxy or Fiddler.

To import a HAR file:

```shell  theme={null}
wiremock import recording.har --to=33eye3l9
```

The CLI will convert each HTTP request/response pair in the HAR file into a WireMock stub mapping.

**Example HAR file structure:**

```json  theme={null}
{
  "log": {
    "entries": [
      {
        "request": {
          "method": "GET",
          "url": "https://api.example.com/users"
        },
        "response": {
          "status": 200,
          "content": {
            "text": "{\"users\": []}"
          }
        }
      }
    ]
  }
}
```

### Postman Collections

Postman collections can be exported from Postman and imported into WireMock Cloud. The CLI supports both Collection v2.0 and v2.1 formats.

To import a Postman collection:

```shell  theme={null}
wiremock import my-collection.postman_collection.json --to=33eye3l9
```

The CLI will convert each request in the collection into a stub mapping, using:

* The request method, URL, headers, and body as matchers
* Example responses (if defined) as the stub response

### OpenAPI/Swagger Specifications

OpenAPI (formerly Swagger) specifications can be imported to automatically generate stub mappings for all defined endpoints.

To import an OpenAPI specification:

```shell  theme={null}
wiremock import openapi-spec.yaml --to=33eye3l9
```

Or for JSON format:

```shell  theme={null}
wiremock import openapi-spec.json --to=33eye3l9
```

The CLI will generate stub mappings for each endpoint defined in the specification, using:

* Path and method from the operation definition
* Example responses from the specification (if provided)
* Schema-based response generation (if no examples are provided)

<Note>Both OpenAPI 3.x and Swagger 2.0 formats are supported.</Note>

## Format Detection

The import command automatically detects the format of the input based on:

* File extension (`.har`, `.json`, `.yaml`, `.yml`)
* File content structure (Postman collection schema, OpenAPI schema, HAR format, WireMock stub format)
* Directory structure (presence of `mappings` and `__files` subdirectories for WireMock OSS)

You don't need to specify the format explicitly - the CLI will determine it automatically and process the file accordingly.

## Advanced Configuration

The `import` command supports advanced configuration through an import configuration file. This allows you to transform stub mappings during import, similar to how the [recording configuration](/cli/recording-configuration) works.

### Using an Import Configuration File

To use an import configuration file:

```shell  theme={null}
wiremock import <file_or_directory> \
  --to=<mock-api-id> \
  --import-config-file=<path>
```

where `<path>` is the path to a YAML file containing import configuration.

The import configuration file uses the same format as the recording configuration file, allowing you to apply transformation rules to the imported stubs. This works with **all import formats** (WireMock OSS, HAR, Postman, OpenAPI/Swagger). This is useful when you need to:

* Modify request matchers to be more or less specific
* Add additional matching criteria
* Standardize stub definitions from different sources
* Apply consistent transformations when importing from multiple formats

For details on the configuration file format, see the [Advanced Recording Configuration](/cli/recording-configuration) page and the [import-config-file-schema](/cli/import-config-file-schema) reference.

## Notes

* The import command **adds** stubs to the specified Mock API without removing existing stubs
* If you want to replace all stubs in a Mock API, the [push](/cli/push-pull-mock-api) command may be more suitable

## See Also

* [Advanced Recording Configuration](/cli/recording-configuration) - for details on transformation rules
* [Import Config File Schema](/cli/import-config-file-schema) - for the complete schema reference
* [Pushing and Pulling Mock APIs](/cli/push-pull-mock-api) - for alternative ways to manage Mock API content

