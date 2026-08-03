> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Stubbing Basics

> Overview of WireMock Cloud's stubbing capabilities

WireMock Cloud at its core, like [WireMock](https://wiremock.org) which underpins it is an HTTP stubbing tool. This means that it can be configured to return specific canned responses depending on the request.

This can be a simple as just matching the URL, right up to a combination of URL, header and body matches using regexes, JSONPath, XPath and others.

## Creating a basic stub

Select the mock API you'd like to work in, then navigate to the Stubs page and hit the New Stub button. Change the URL field from thedefault value to whatever you'd like to match on e.g. `/hello-world`.

<img alt="basic-new-stub" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/basic-new-stub.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=2e180635766c53e3ba2501e9a59c854e" title="New Stub Request" width="851" height="231" data-path="images/screenshots/basic-new-stub.png" />

In the Response section, set HTTP status, headers and body text. Typically it is a good idea to send a `Content-Type` header in HTTP responses, so add one by clicking New Header and setting `Content-Type` to `application/json`.

<img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/basic-response.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=bd34079482506e503161e77cabd8df9c" alt="Basic response" width="919" height="581" data-path="images/screenshots/basic-response.png" />

Hit Save, then you're ready to test your stub. Point your browser to `http://<your-subdomain>.wiremockapi.cloud/hello-world`.
You should see the text that you entered into the body text box. You can find out what your
subdomain is on the Settings page for the mock API.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/mock-api-browser-screenshot.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=5b77cad88396c58d95cbcea317a17a83" alt="Mock response served" width="760" height="455" data-path="images/screenshots/mock-api-browser-screenshot.png" />

