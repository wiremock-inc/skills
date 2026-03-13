> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Simulating Faults

> Responding with network and HTTP faults

Real-world APIs and the networks used to communicate with them can fail in ways that can destabilise your application,
and are hard to test.

WireMock Cloud supports responding to requests with four different fault types:

* Server closes connection before response sent
* Corrupt data sent, then connection closed
* OK response sent, followed by corrupt data and connection close
* Peer connection reset - `SO_LINGER` is set to 0 causing a non-graceful TCP connection termination.

These are configured per stub, so it is possible to respond to specific requests with a fault.

## Usage

Faults are configured when creating or editing a stub by selecting the Fault tab in the response and choosing the fault type:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/fault-response.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=f35340456d874f3ed5c306f0650d7151" title="Fault response" width="424" height="244" data-path="images/screenshots/fault-response.png" />

