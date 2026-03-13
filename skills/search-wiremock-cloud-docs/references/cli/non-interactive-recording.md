> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Non-interactive Recording Sessions

> How to use the WireMock CLI to record in a non-interactive way

As of version `0.28.0`, the WireMock CLI supports running recording commands in non-interactive mode, making it ideal
for CI/CD pipelines and automated environments where user interaction is not possible or desired. The CLI automatically
detects whether it's running in an interactive terminal and adjusts its behavior accordingly.

## Interactive vs Non-Interactive Mode

There are a number of differences between interactive and non-interactive modes:

### Interactive Mode (Default)

* **User Control**: User presses Enter to stop recording or ESC to cancel
* **Request Logging**: Default request log level is `summary` - shows incoming requests during recording
* **Output**: Displays progress messages and prompts in the terminal for user input

### Non-Interactive Mode

* **Signal Control**: Process responds to system signals (SIGTERM) for termination
* **Request Logging**: Default request log level is `off` - minimal console output for cleaner logs.  This can still be
  overridden with the `--request-log-level` option.
* **Output**: Reduced console output optimized for log parsing

## Signal Handling and Process Termination

### Graceful Shutdown

Non-interactive recording sessions respond to the standard **SIGTERM** Unix signal:

* **SIGTERM**: Graceful shutdown - stops recording and processes all captured traffic

### Using `pkill` for Termination

The recommended approach for terminating recording processes is using `pkill` with the SIGTERM signal:

```bash  theme={null}
# Start recording in background
wiremock record --to=cloud:<mock_api_id> https://api.example.com > wiremock.log 2>&1 &
WIREMOCK_PID=$!

# Later, gracefully terminate the process and
pkill -TERM -P $WIREMOCK_PID
```

### Example Termination Script

```bash  theme={null}
#!/bin/bash

# Start WireMock recording
wiremock record --to=cloud:<mock_api_id> https://api.example.com > wiremock.log 2>&1 &
WIREMOCK_PID=$!

# Perform your HTTP requests here
# ...

# Graceful termination
echo "Terminating WireMock CLI (PID: $WIREMOCK_PID)..."
pkill -TERM -P $WIREMOCK_PID 2>/dev/null

# Wait for graceful shutdown (with timeout)
TIMEOUT=10
COUNT=0
while kill -0 $WIREMOCK_PID 2>/dev/null && [ $COUNT -lt $TIMEOUT ]; do
    sleep 1
    COUNT=$((COUNT + 1))
done

# Display the captured output
echo ""
echo "=== WireMock CLI Output ==="
cat wiremock.log

echo ""
```

The above examples show the `record` command, but the same approach applies to `record-many`.  They also show output
redirection to a log file.

