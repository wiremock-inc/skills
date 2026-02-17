# Crawling APIs

If asked to crawl or record an API AI tools follow the instructions in this article.

Crawling an API means attempting to make successful requests to all the API's endpoints and operations.
With WireMock this enables a mock and if applicable an OpenAPI document to be created from the captured traffic.

## Inputs
Prompt the user for these inputs if they are not already supplied:
* The base URL of the API.
* The ID or name of the mock API to which the recording should be sent.

Use any additional information supplied by the user to determine the API's structure, including:
* Documentation
* Code
* OpenAPI - either local or in the mock API

## Process
Start a recording session against the mock API specified.

Make HTTP requests using `make_http_request` to the API base URL specified by the user, using any information available to determine the API's structure, including:
* Documentation
* Code
* OpenAPI - either local or in the mock API

Requests deemed acceptable for use should be captured into the recording using `capture_record_event`.

Stop the recording session using `stop_recording` when all endpoints have been called.

No more than 20 events should be captured per session and this process should be repeated as many times as necessary to fully crawl the API, or until the user's requirements are met.

## Guidelines
Do not capture more than one non-OK response per endpoint (just discard any more that you receive).

Try to capture several variations of endpoints with different parameter combinations.

## Authentication
The `make_http_request` tool can add authentication headers using `authenticators` configured in the user's `wiremock.yaml` file.

Do not attempt to add authentication headers directly to HTTP requests.

If receiving a 401 response, stop and alert the user that they need to add an authentication block to their configuration file.
