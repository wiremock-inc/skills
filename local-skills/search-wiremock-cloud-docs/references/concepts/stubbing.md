<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Stubbing

> Understanding stubs: the building blocks of API simulation

The fundamental building block of a simulation is a **stub**. A stub represents a rule that tells WireMock how to respond when it receives certain kinds of requests.

Stubbing is a concept from the underlying [WireMock OSS](https://wiremock.org/docs/stubbing/) engine — if you're already familiar with stubs from open-source WireMock, everything here carries over directly.

A stub consists of two main parts:

1. **Request matching criteria** - The conditions that an incoming request must satisfy to trigger this stub
2. **Response definition** - A recipe for generating and returning a response when the criteria match

## How Stubs Work

When WireMock receives an HTTP request, it evaluates that request against each stub in order, from top to bottom. The first stub whose request criteria fully match the incoming request is selected, and its response definition is used to generate the response.

This top-to-bottom matching order is important: more specific stubs should typically be placed before more general ones to ensure they are evaluated first.

## Request Matching

Request matching can examine any part of an incoming HTTP request:

* **HTTP method** (GET, POST, PUT, DELETE, etc.)
* **URL path** and path patterns
* **Query parameters**
* **HTTP headers**
* **Request body content**
* **Cookies**

Matching can use simple equality checks or more sophisticated criteria:

* Exact matches for precise control
* Pattern matching with wildcards or regular expressions
* Content-type specific matching (e.g., JSON path queries, XML XPath expressions)
* Absence checks (matching when something is NOT present)
* Multiple criteria combined with logical AND/OR operations

The flexibility of request matching allows you to create both broad catch-all stubs and highly specific stubs that only match very particular requests.

## Response Definitions

Once a stub matches a request, it uses its response definition to determine what to return. Response definitions can be:

* **Static responses** - Fixed, pre-defined data returned every time
* **Templated responses** - Dynamic content generated using variables, request data, and helper functions
* **Fault responses** - Simulated network errors, timeouts, or malformed data
* **Proxy responses** - Forward the request to another system and return its response

Responses can include:

* HTTP status codes
* Headers
* Body content (JSON, XML, plain text, binary data, etc.)
* Delays to simulate latency
* State changes for stateful scenarios

A stub can also optionally trigger a [webhook](/webhooks) call.

## Stub Organization

Stubs are organized within Mock APIs, which are collections of related stubs that simulate a particular API or service. Within a Mock API:

* Stubs can be created, edited and deleted independently
* The order of stubs affects which one matches first
* A priority can be set on a stub explicitly, which will take precedence of the order

### Deleting All Stubs

If you have permission to delete stubs, A "Delete All Stubs" button is available
on the mock API **Settings** page in the **Danger Zone** section at the bottom of the
page. Clicking it opens a confirmation dialog. If the user confirms, all stubs for
that mock API are deleted.

<Note>
  This action can be reverted using the mock API's **[Version History](/versioning/overview)**.
</Note>

#### How to use

1. Navigate to the mock API you want to clear.
2. Open the **Settings** page.
3. Scroll to the **Danger Zone** section at the bottom.
4. Click the **Delete All Stubs** button.
5. A confirmation dialog appears: *"Are you sure you want to delete all stubs?"*
6. Click **Yes** to confirm, or **No** to cancel.
7. On success the dialog closes and you remain on the settings page. All stubs for
   the mock API are removed regardless of any active search or filter.
