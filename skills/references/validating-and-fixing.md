# Validating and fixing stub mappings

If asked to validate and fix stub mappings, follow these steps:
1. Fetch the stub mappings from the mock API using the `get_stub_mappings` tool.
2. For each stub do the following:
   1. Reset the request journal using `reset_request_journal`
   2. Make a test request for the stub mapping using `make_http_request`.
   3. Get the request journal using `get_request_journal`.
   4. If there are any response validation errors, fix the stub mapping and repeat from step 2.1.

It is important to repeat the process until there are 0 validation errors reported.
