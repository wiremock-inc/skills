# Validating and fixing stub mappings

If asked to validate and fix stub mappings, follow these steps:
1. Fetch the stub mappings from the mock API using the `search_stub_mappings` tool.
2. For each stub do the following:
   1. Reset the request journal using `reset_request_journal`
   2. Make a test request for the stub mapping against the mock API's base URL.
# @variant:remote
      Use `curl` via `Bash` — there is no MCP tool for making arbitrary HTTP requests, so this must be a real HTTP call.
# @variant:local
      Use the `make_http_request` tool.
# @endvariant
   3. Get the request journal using `search_request_journal`.
   4. If there are any response validation errors, fix the stub mapping and repeat from step 2.1.

It is important to repeat the process until there are 0 validation errors reported.
