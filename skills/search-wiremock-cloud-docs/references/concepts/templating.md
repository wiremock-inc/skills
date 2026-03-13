> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Templating

> Understanding how dynamic content is generated throughout WireMock Cloud

WireMock Cloud uses **Handlebars templating** to generate dynamic content wherever responses, data, or outbound requests need to be customized based on runtime information. This templating system enables you to create flexible, context-aware simulations that respond intelligently to incoming requests, state changes, and data sources.

## What is Templating?

Templating is a mechanism for generating content dynamically by combining a template with data from the current context. A template contains both static content and special expressions (called "helpers") that are evaluated at runtime to produce dynamic values.

For example, this simple template:

```handlebars  theme={null}
Hello {{request.query.name}}!
```

Will output "Hello Alice!" when a request arrives with `?name=Alice` in the query string.

## Where Templating is Used

Templating can be applied throughout WireMock Cloud wherever dynamic content needs to be produced:

### Stub Response Bodies

The most common use of templating is in stub response bodies, where you need to return data that reflects information from the incoming request. This allows a single stub to serve many variations of a response rather than requiring separate stubs for each case.

For example, a templated response body can echo back data from the request, generate unique identifiers, incorporate current timestamps, or extract and transform request data using JSONPath or XPath.

### Response Headers

Response header values can be templated to return dynamic metadata. This is useful for generating correlation IDs, setting cache headers based on request parameters, or returning computed values in custom headers.

### Webhook Request Bodies

When [webhooks](/webhooks) are triggered by incoming requests, their request bodies can be templated to include data from the original request, current state, or data sources. This allows webhooks to send contextual notifications or trigger downstream systems with relevant information.

### Webhook URLs and Headers

Similarly, webhook request URLs and header values can use templating to determine the destination or metadata for outbound calls dynamically. This enables patterns like routing webhooks to different endpoints based on request content or environment.

### Proxy URLs

When using the proxy feature, the target URL can be templated to determine the destination dynamically based on the incoming request. This supports sophisticated routing scenarios where different requests should be forwarded to different backend services.

## The Templating Engine

WireMock Cloud uses [Handlebars](https://handlebarsjs.com/), a mature and widely-used templating language. Handlebars provides:

* **Variable substitution** - Access to request data, state, and data sources
* **Helper functions** - Built-in and custom functions for transformations and logic
* **Conditional logic** - If/else blocks for branching behavior
* **Iteration** - Loops over collections of data
* **Nested expressions** - Combining helpers to build complex transformations

The basic syntax uses double curly braces `{{...}}` to mark dynamic expressions within otherwise static content.

## Helpers for Specific Tasks

WireMock Cloud provides an extensive library of helper functions that extend Handlebars with capabilities specifically designed for API simulation:

* **JSONPath helpers** - Extract values from JSON request bodies using path expressions
* **XPath helpers** - Query XML request bodies
* **String manipulation** - Substring, replace, case conversion, and more
* **Date and time** - Format dates, parse timestamps, generate dates relative to now
* **Random data generation** - UUIDs, random numbers, realistic fake data
* **Encoding and decoding** - Base64, URL encoding, JSON escaping
* **Cryptographic functions** - Hashing, signing, JWT generation and validation
* **State access** - Read and reference values from stateful scenarios
* **Data source queries** - Retrieve data from CSV or database sources

These helpers can be combined and nested to build sophisticated dynamic responses from simple templates.

## The Request Model

When templates are evaluated, they have access to a data model that represents the current context. The primary element of this model is the `request` object, which contains all attributes of the incoming HTTP request:

* URL path, query parameters, and path segments
* HTTP method, headers, and cookies
* Request body (as text or Base64)
* Multipart form data and file uploads

This request data can be accessed directly in templates using expressions like `{{request.headers.Authorization}}` or `{{request.query.productId}}`.

In webhook templates, the triggering request is available as `originalRequest` to distinguish it from any request data that might be constructed for the webhook itself.

For a complete reference of all available request attributes and how to access them, see the [Request Model Reference](/response-templating/request-model).

## Enabling Templating

Templating must be explicitly enabled on a per-stub basis by checking the "Enable templating" option when configuring a stub response. This ensures that static responses remain performant and that template expressions are only evaluated when needed.

Once enabled, templating applies to:

* Response body
* Response header values
* Proxy URL (if using proxy mode)
* Any configured webhook attributes

## Learn More

For a comprehensive guide to using templating in stub responses, including syntax details and the request data model, see [Response Templating](/response-templating/basics).

For a complete reference of all available helpers organized by category, see the [Templating reference section](/response-templating/conditional-logic-and-iteration) in the documentation.

