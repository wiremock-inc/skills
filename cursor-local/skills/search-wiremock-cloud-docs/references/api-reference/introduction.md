<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Introduction

> Welcome to the WireMock Cloud API

## Summary

This area provides an API playground where you can try out WireMock Cloud's API and send API calls to its
various endpoints, from managing users, mock APIs and teams to recording stub mappings, just to name a few.

On the left-hand side of the page, you can find a list of all the available endpoints grouped by functional areas.
When selecting one, its details appear along with its request and response specification, as well as code examples that are
available in a few different languages.

## Sending API calls

Once you selected an endpoint, you can send requests to it by clicking the **Try it** button next to the endpoint path.

<img src="https://mintcdn.com/wiremockinc/96u0velHlPJgIuhT/images/api-reference/introduction-endpoint-summary.png?fit=max&auto=format&n=96u0velHlPJgIuhT&q=85&s=50fe081c46f892702d8914a3db31a356" alt="WireMock Cloud API endpoint summary" width="600" height="163" data-path="images/api-reference/introduction-endpoint-summary.png" />

This opens up an overlay where you can enter the necessary request parameters, body, etc. and can actually send your request.

<img src="https://mintcdn.com/wiremockinc/96u0velHlPJgIuhT/images/api-reference/introduction-request-sender.png?fit=max&auto=format&n=96u0velHlPJgIuhT&q=85&s=b4f62ec7ab456eb3998eb10841bcc4ae" alt="WireMock Cloud API request sender overlay" width="1189" height="520" data-path="images/api-reference/introduction-request-sender.png" />

There are two hosts you can choose from:

<img src="https://mintcdn.com/wiremockinc/96u0velHlPJgIuhT/images/api-reference/introduction-host-selector.png?fit=max&auto=format&n=96u0velHlPJgIuhT&q=85&s=6a5c238cf0ccac58f02c22712d223d14" alt="WireMock Cloud API host selector" width="804" height="126" data-path="images/api-reference/introduction-host-selector.png" />

* `wmc.wiremockapi.cloud`: uses a mock API, and supplies canned data
* `api.wiremock.cloud`: uses the production API, so you will get real data

### Authorization

The endpoints require the Authorization header to be set for which you can use the following formats:

* `Token <api token>` (the [Authentication](/authentication) page describes how to find your API token)
* `Basic <base64 encoded username:apitoken>`
