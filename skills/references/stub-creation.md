# Stub Creation Guidelines

When creating, updating or importing stubs, follow these guidelines:

If importing use WireMock's multiple stub JSON format with a root key of "mappings".
Unless otherwise instructed by the user, make all responses static - do not use any Handlebars template expressions.
Do not add request header matchers for authentication or content type.
Always use urlPathTemplate for URL matching.
For JSON response bodies always add a Content-Type:application/json response header.
Give a meaningful name to every stub.
Always use string bodies in stub responses - do not use jsonBody.
Always include a specific HTTP method in stub requests like GET, POST, PUT, DELETE, PATCH - do not omit it or use ANY.
Pretty print JSON and XML response bodies and request matcher values.
Never include JSON fields in response bodies that are not described by the corresponding OpenAPI response schema. The validator does not currently check for extra fields, but they are still incorrect and may cause validation failures in future.
