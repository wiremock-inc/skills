> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Request Model Reference

> Complete reference for accessing request data in templates

When templates are evaluated, they have access to a data model that represents the incoming HTTP request. This page provides a complete reference of all available request attributes and how to access them in your templates.

## The Request Object

The data model supplied to response templates contains a single top-level object called `request` which represents the incoming HTTP request. All request attributes are accessed as properties of this object.

## URL Attributes

### request.url

The full URL path and query string.

**Example:** `/products/123?color=red&size=large`

### request.path

The URL path without query parameters.

**Example:** `/products/123`

### request.path.\[n]

Individual URL path segments, accessed by zero-based index.

**Example:** For path `/api/products/123`, `request.path.[2]` returns `123`

## Query Parameters

### request.query.key

The values for a specific query parameter.

**Example:** `request.query.search` returns `laptop` for `?search=laptop`

<Warning>
  Referencing a query parameter in this manner will return a list of values, but as a convenience only the first will be printed.
  As a general rule if you wish to use the first (or only) value of a query parameter in a further expression rather than printing it,
  it is necessary to reference it by index explicitly as shown below e.g. `request.query.productId.[0]`
</Warning>

### request.query.key.\[n]

nth value of a query parameter (zero-indexed), for parameters with multiple values.

**Example:** `request.query.tags.[1]` returns `electronics` for `?tags=new&tags=electronics`

## HTTP Method and Protocol

### request.method

The HTTP request method.

**Example:** `POST`, `GET`, `PUT`, `DELETE`

### request.scheme

The protocol part of the URL.

**Example:** `https`, `http`

## Host and Port

### request.host

The hostname part of the URL.

**Example:** `api.example.com`

### request.port

The port number.

**Example:** `8080`, `443`

### request.baseUrl

The full URL up to the start of the path, including scheme, host, and port.

**Example:** `https://api.example.com:8080`

## Headers

### request.headers.key

First value of a request header. Header names are case-insensitive.

**Example:** `request.headers.X-Request-Id` or `request.headers.Content-Type`

<Warning>
  Referencing a header in this manner will return a list of values, but as a convenience only the first will be printed.
  As a general rule if you wish to use the first (or only) value of a header in a further expression rather than printing it,
  it is necessary to reference it by index explicitly as shown below e.g. `request.headers.X-Proxied-Via.[0]`
</Warning>

### request.headers.\[key]

Alternative syntax for headers with special characters that aren't valid in property names.

**Example:** `request.headers.[$?blah]`

### request.headers.key.\[n]

nth value of a header (zero-indexed), for headers with multiple values.

**Example:** `request.headers.Accept.[1]`

## Cookies

### request.cookies.key

First value of a request cookie.

**Example:** `request.cookies.JSESSIONID`

<Warning>
  Referencing a cookie in this manner will return a list of values, but as a convenience only the first will be printed.
  As a general rule if you wish to use the first (or only) value of a cookie in a further expression rather than printing it,
  it is necessary to reference it by index explicitly as shown below e.g. `request.cookies.X-Proxied-Via.[0]`
</Warning>

### request.cookies.key.\[n]

nth value of a cookie (zero-indexed), for cookies with multiple values.

**Example:** `request.cookies.tracking.[2]`

## Request Body

### request.body

The request body as text. Avoid using this for binary content.

**Example:** For JSON request body, `request.body` contains the raw JSON string

### request.bodyAsBase64

The Base64-encoded representation of the request body. Use this for binary content.

## Request Identity

### request.id

A random UUID assigned by WireMock Cloud to every request. Useful for correlation and debugging.

**Example:** `a3c5e8f2-4b1d-4e9a-8f7c-2d1e3b4a5c6d`

## Multipart Requests

### request.multipart

Boolean indicating whether the request is a multipart request.

**Example:** `true` or `false`

### request.parts

For multipart requests, the individual parts are exposed via the template model. Each part can be referenced by its name and exposes several properties.

For a multipart request with a part named `text`, the following properties are available:

#### request.parts.text.binary

Boolean indicating if the part contains binary data.

#### request.parts.text.headers.key

First value of a header within the multipart part.

**Example:** `request.parts.text.headers.content-type`

#### request.parts.text.body

The part's body content as text.

#### request.parts.text.bodyAsBase64

The part's body content as Base64-encoded string.

## Values That Can Be One or Many

A number of HTTP elements (query parameters, form fields, headers, cookies) can be single or multiple valued. The template request model handles this elegantly with a "list or single" type that:

* Returns the first (and often only) value when no index is specified
* Supports indexed access for multiple values
* Provides convenience accessors like `first` and `last`

### Accessing Single or Multiple Values

Given a request URL like `/multi-query?things=1&things=2&things=3`, you can extract query data in several ways:

```handlebars  theme={null}
{{request.query.things}}       // Returns: 1
{{request.query.things.0}}     // Returns: 1
{{request.query.things.first}} // Returns: 1
{{request.query.things.1}}     // Returns: 2
{{request.query.things.[-1]}}  // Returns: 2
{{request.query.things.last}}  // Returns: 3
```

### Important Note About Comparisons

When using the `eq` helper with one-or-many values, you must use the indexed form, even if only one value is present.

The non-indexed form returns the wrapper type (not a String), which will fail comparisons with String values.

**Correct:**

```handlebars  theme={null}
{{#if (eq request.query.status.0 "active")}}
  Status is active
{{/if}}
```

**Incorrect:**

```handlebars  theme={null}
{{#if (eq request.query.status "active")}}
  This will not work as expected
{{/if}}
```

## Using the Request Model in Webhooks

In [webhook](/webhooks) templates, the triggering request is available as `originalRequest` instead of `request`. This distinguishes it from any request data being constructed for the webhook itself.

**Example:** `{{originalRequest.headers.X-Correlation-Id}}`

