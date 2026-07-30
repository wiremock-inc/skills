---
name: author-response-templates
user-invocable: false
description: Author and debug Handlebars response templates for WireMock stubs. Use when the user needs help writing or fixing response templates with formatJson, arrayJoin, state helpers, pagination, or brace collision issues.
argument-hint: "<mock-api-name-or-id>"
allowed-tools:
  - Read(../references/*)
  - Bash(curl:*)
  - mcp__plugin_wiremock-cloud_wiremock__who_am_i
  - mcp__plugin_wiremock-cloud_wiremock__search_my_mock_apis
  - mcp__plugin_wiremock-cloud_wiremock__search_stub_mappings
  - mcp__plugin_wiremock-cloud_wiremock__update_stub_mapping
  - mcp__plugin_wiremock-cloud_wiremock__search_request_journal
  - mcp__plugin_wiremock-cloud_wiremock__reset_request_journal
  - mcp__plugin_wiremock-cloud_wiremock__list_data_sources
  - mcp__plugin_wiremock-cloud_wiremock__get_data_source
  - mcp__plugin_wiremock-cloud_wiremock__get_data_source_data
  - mcp__plugin_wiremock-cloud_wiremock__look_up_documentation
---

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

## Reference Documentation

Read these references before authoring templates:

- [Response Template Authoring](../references/response-templating.md) - guidelines for Handlebars response templates, formatting, brace collision avoidance, and pagination metadata
- [Stateful Stubbing](../references/stateful-stubbing.md) - state helpers (`{{state}}`, `{{listState}}`, `{{jsonMerge}}`) and SET value templates
- [Data-Driven Stubbing](../references/data-driven-stubbing.md) - data source iteration with `data.items`, `{{arrayJoin}}`, and SQL WHERE clauses

## Instructions

The target mock API is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user which mock API to work with.

1. Identify the target mock API using `search_my_mock_apis`.
2. Read the [Response Template Authoring](../references/response-templating.md) reference.
3. Understand the user's goal — are they writing a new template, debugging an existing one, or adding features like pagination?
4. If debugging, fetch the relevant stubs with `search_stub_mappings` and test them with `curl` via `Bash` (there is no MCP tool for making arbitrary HTTP requests) to reproduce the issue.
5. Author or fix the template following the guidelines:
   - Use `{{#formatJson}}` to wrap JSON output
   - Use `{{~#arrayJoin}}` with tilde whitespace trimming for arrays
   - Pretty-print JSON in templates to avoid triple-brace collisions
   - Avoid `{{replace}}` for generating structural JSON characters
   - For pagination, use LIMIT/OFFSET in data queries and compute metadata with `{{val}}` and `{{math}}`
6. Update the stub using `update_stub_mapping`.
7. Test the updated stub with `curl` via `Bash` and check the request journal for errors.
8. Report the results to the user.
