# Response Template Authoring

Guidelines for authoring Handlebars response templates in WireMock stubs.

## Formatting output

Use `{{#formatJson}}` to wrap the response body so the output is well-formed JSON. Inside this block, use `{{~#arrayJoin ',' data.items as |item|~}}` to iterate over matched rows and produce
comma-separated JSON objects. The `~` tilde characters trim whitespace to prevent unwanted spaces or newlines in the output.

Conditional fields based on column values work as expected. Empty or null CSV cells evaluate as falsy in `{{#if}}` blocks. Use `{{#eq item.type 'openapi'}}` for equality checks against specific values.

## Avoiding triple-brace parse errors

Since both Handlebars and JSON use braces as delimiters, it's often possible to end up with a template expression followed by a closing JSON brace being mis-parsed as a Handlebars triple brace `}}}`. This applies to all Handlebars expressions at JSON object/array boundaries, not just `{{now}}`.

**Always pretty-print JSON in templates** to keep Handlebars `}}` and JSON `}` on separate lines:

**Broken** (single line — `}}}` triggers triple-stache):
```
"value": "{\"id\":\"{{id}}\",\"created\":{{now format='epoch'}}}"
```

**Working** (pretty-printed — braces separated):
```
"value": "{\n  \"id\": \"{{id}}\",\n  \"created\": {{now format='epoch'}}\n}"
```

This is especially important in SET value templates for stateful stubs, where a triple-stache collision will silently corrupt the stored value.

## The `{{replace}}` helper HTML-encodes output

The `{{replace}}` helper HTML-encodes its output, so double quotes become `&quot;`. This breaks JSON if you try to use replace to generate structural JSON characters like quotes. Avoid using replace for this purpose and instead construct the desired values directly in the template.

## Pagination metadata

Use LIMIT and OFFSET in the data WHERE clause to paginate data. Here is an example implementing page/limit style pagination:
`{{val request.query.limit.0 or=10 assign='limit'}}{{val request.query.page.0 or=1 assign='page'}}{{val (math (math page '-' 1) '*' limit) assign='offset'}} ORDER BY departure_time LIMIT {{limit}} OFFSET {{offset}}`

`data.items` will contain only the current page of results. Use `{{size data.items}}` for the count since `data.total` is not populated. Pagination metadata such as `totalPages` can be computed in the template using `{{val}}` assignments and `{{math}}` expressions.
