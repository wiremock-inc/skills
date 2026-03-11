> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Simulating gRPC services

> Simulating your gRPC APIs.

WireMock Cloud enables you to mock your gRPC APIs in a similar fashion to a general HTTP/HTTPS mock API.
Incoming gRPC messages are converted to JSON for the purpose of request matching and templating.
JSON responses are also converted to gRPC messages before being sent to the client.

## Usage

### Creating a gRPC mock API

To create a gRPC mock API, select the gRPC API template on the mock API creation page and give it a name (and optional
custom hostname) of your choosing.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/grpc/grpc-api-template.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=b7bc17218d2ebbeda70e4d8bcfa0ce1d" alt="gRPC API template" width="1676" height="1034" data-path="images/screenshots/grpc/grpc-api-template.png" />

### Uploading a descriptor set file

Once your API is created, the first step to take before you can configure your stubs is to upload a gRPC descriptor set
file that describes your gRPC services, methods and messages.
Navigate to your mock API's gRPC page and select a file from your file system to upload.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/grpc/upload-descriptor-set-file.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=3769032e912411026252e9a7e0aae526" alt="Uploading a gRPC descriptor set file" width="546" height="409" data-path="images/screenshots/grpc/upload-descriptor-set-file.png" />

See [generating a descriptor set file](#generating-a-descriptor-set-file) for details of how to obtain a descriptor set.

### Configuring gRPC stubs.

Once you've successfully uploaded your descriptor set file you can create stubs for your gRPC API.
The stub form for a gRPC mock API is similar to a general HTTP/HTTPS mock API with a few key differences.
Firstly, each gRPC stub must be associated with a particular service and method defined in the uploaded descriptor set
file.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/grpc/select-stub-service-and-method.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=4ed882eb35baf9713ba76aee63709f64" alt="Selecting a stub's associated gRPC service and method" width="502" height="193" data-path="images/screenshots/grpc/select-stub-service-and-method.png" />

Request matching for gRPC stubs is limited to body matchers.
Additionally, body matchers are constrained to only JSON related matchers (e.g. "equals JSON", "matches JSONPath").

Response statuses can be configured to any valid gRPC status.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/grpc/stub-response-status.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=9f11c491868713cf9949a9f2845328ae" alt="Selecting a stub's associated gRPC service and method" width="461" height="357" data-path="images/screenshots/grpc/stub-response-status.png" />

Response bodies must return valid JSON that conforms to the gRPC method's response message.
For example, given a descriptor set file that was generated from the following proto file:

```protobuf  theme={null}
syntax = "proto3";

service BookingService {
  rpc booking(BookingRequest) returns (BookingResponse);
}

message BookingRequest {
  string id = 1;
}

message BookingResponse {
  string id = 1;
  string created = 2;
  repeated Participant participants = 3;
}

message Participant {
  string name = 1;
}
```

The stub response body for the `booking` method would look something like the following:

```json  theme={null}
{
  "id": "123",
  "created": "2024-08-13T10:12:00",
  "participants": [
    {
      "name": "Bob"
    },
    {
      "name": "Alice"
    }
  ]
}
```

When the response status of your stub is set to a non `OK` status, the response body is not used and a `Status Reason`
must be provided.

An example response body is generated for your stub after selecting the service and method, to help guide the shape of
your responses.
An example request body is also generated for JSON equality body matchers that you add to your stub.

### Testing your stubs

Like with traditional mock APIs, gRPC mock APIs come with a test requester built into the WireMock Cloud app.
This test requester can be used to make real gRPC requests to your mock API via a simple interface.

To use the test requester, make sure to navigate to the gRPC mock API you wish to test in WireMock Cloud, then open the
Test Requester tab on the right side of your browser window.
Select the service and method that you want to make a request to, add any headers you want to include and supply a
request body, if desired.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/grpc/grpc-test-requester.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=5e0a407f6f64622fed55679f8445c8fe" alt="Using the gRPC test requester" width="828" height="660" data-path="images/screenshots/grpc/grpc-test-requester.png" />

After clicking "Send" to perform the request, the response will be displayed, including the status and body.
You will also be able to view this request in your mock API's request log page.

A handy "Copy gRPCurl command" button is also provided by the test requester that allows you to make a similar request
using the popular [gRPCurl CLI tool](https://github.com/fullstorydev/grpcurl).
Clicking this button will copy a gRPCurl command to your clipboard that you can then paste into your favourite terminal
to execute (provided you have gRPCurl installed).

## Generating a descriptor set file

To generate a descriptor set file from your proto file, simply add the `--descriptor_set_out` option to your protoc
command.
For example,

```bash  theme={null}
protoc --descriptor_set_out my-api.dsc MyApi.proto
```

