# Recording from a Sandbox

Follow this process when a live sandbox/test environment is available for recording stubs.

## Set Up Authentication

1. Determine the authentication scheme from the API docs and OpenAPI spec.
2. If the user didn't supply an authenticator file, create one (e.g. `auth-config.yaml`) in an `authenticators` sub-directory of the working directory with the correct structure but placeholder values. `authenticators` should be excluded from git.
3. **Stop and ask the user** to fill in the real credentials. Do not proceed until the user confirms the authenticator file is complete.

## Record Against the Sandbox

1. Start recording using `start_recording` with:
   - `baseUrl` set to the sandbox URL
   - `destination` set to `cloud:<mock_api_id>`
2. Use `get_recording_status` to find out the proxy port assigned to the recording session.

## Exercise the API Through the Recorder

1. Send a request for every operation in the OpenAPI spec against the recorder at `http://localhost:<recorder-port>`, using the authentication from `auth-config.yaml`. Use realistic example data in request bodies that is consistent with the OpenAPI schemas. Where an operation depends on data created by a previous operation (e.g. a GET that retrieves a resource created by a POST), chain the requests and pass the identifier from the first response into the subsequent requests.

2. **If any request fails:**
   - Stop the recording (cancel it, do not persist the captured stubs).
   - Examine the responses to identify the failure.
   - Fix the request data (or authentication setup) as needed.
   - Start a new recording session and retry.
   - Repeat until every operation succeeds.

3. **When all requests succeed:**
   - Stop the recording normally so the captured stubs are saved.

## Verify Against the Mock API

1. **Smoke test first.** Before the full run, manually test one create + retrieve cycle against the mock API to verify the basic flow works and passes OpenAPI validation. This gives fast feedback before the slower full sweep.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](validating-and-fixing.md).
3. Send a request for every operation against the **mock API's base URL** (not the recorder) using `make_http_request`.
4. Check the request journal for response validation errors.
5. If any requests fail or return validation errors, fix **stubs only**. Do NOT change the OpenAPI description.
6. Repeat until all requests succeed and the request journal shows zero validation errors.
