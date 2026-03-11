> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Chaos settings - Basics

> Proxying requests to other systems

The idea of the chaos settings is to introduce an element of failure into your
environment and observe how clients cope with it.

WireMock Cloud now allows introducing a random element of chaos across all the
calls to a particular API. This would allow you to check that your client
behaves appropriately; closes resources correctly, times out correctly, conveys
sensible error messages to the end user and to your monitoring systems, perhaps
opens circuit breakers to take load off the upstream system or other resilience
mechanisms.

## Enabling Chaos

You enable chaos by toggling the "Enable chaos" switch.

<img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/chaos/enable.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=b7cf24f04b7b1dffa437343d6cc201d9" alt="Enable chaos" width="617" height="104" data-path="images/chaos/enable.png" />

Once chaos is enabled, you can set a percentage of requests to that API to
experience a failure using the slider, or type it directly.

<img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/chaos/slider.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=184f2b77342e3da6457cbf187f1afc8e" alt="Chaos percentage slider" width="633" height="116" data-path="images/chaos/slider.png" />

The configured percentage of failures will be distributed evenly among the
failure modes.

We support five failure modes:

### [Socket close](#socket-close)

A request will just have the socket closed, with no data returned to the client
at all. This would allow you to check that your client closes all resources
appropriately in response.

### [Socket reset](#socket-reset)

The server will close the connection, setting `SO_LINGER` to 0 and thus
preventing the `TIME_WAIT` state being entered. Typically causes a
"Connection reset by peer" type error to be thrown by the client.

Note: this only seems to work properly on \*nix OSs. On Windows it will most
likely cause the connection to hang rather than reset.

This would allow you to check that your client closes all resources
appropriately in response.

### [Invalid HTTP](#invalid-http)

The server will start by responding with a valid HTTP status line, then will
return random bytes, so an invalid HTTP response. Then it will close the
connection.

### [Long delay](#long-delay)

The server will delay for the configured amount of time before responding. This
would allow you to check that you have appropriately configured timeouts.

<img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/chaos/long-delay.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=9a3e0bda31631f4dbc00013aa556e727" alt="Chaos long delay" width="641" height="115" data-path="images/chaos/long-delay.png" />

### [HTTP Error status](#http-error-status)

The server will return valid HTTP responses with the configured error status
codes.

<img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/chaos/http-errors.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=e79ede560b123f38e9b7671da0278f27" alt="Chaos http errors" width="652" height="111" data-path="images/chaos/http-errors.png" />

