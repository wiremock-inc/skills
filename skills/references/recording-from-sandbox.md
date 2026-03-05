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

## Run Arazzo Workflows Through the Recorder

1. Run the Arazzo workflows using `run_workflow` with:
   - `arazzoPath`: path to the local Arazzo document
   - `baseUrls`: override the source's base URL to `http://localhost:<recorder-port>`
   - `authConfigFiles`: include the path to `auth-config.yaml`

2. **If the run fails:**
   - Stop the recording (cancel it, do not persist the captured stubs).
   - Examine the run report to identify failures.
   - Fix the Arazzo workflows and/or request data.
   - Start a new recording session and retry.
   - Repeat until the entire run succeeds.

3. **When the run succeeds:**
   - Stop the recording normally so the captured stubs are saved.

## Verify Against the Mock API

1. **Smoke test first.** Before running the full suite, manually test one create + retrieve cycle against the mock API to verify the basic flow works and passes OpenAPI validation. This gives fast feedback before the slower full suite.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](validating-and-fixing.md).
3. Run the Arazzo workflows against the **mock API's base URL** (not the recorder).
4. If any steps fail, fix **stubs only**. Do NOT change the Arazzo workflows or OpenAPI description.
5. Repeat until all workflows pass.
