> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Delays

> Adding delays to stub responses

Calls over a network to an API can be delayed for many reasons e.g. network congestion or excessive server load. For applications
to be resilient they must be designed to cope with this inevitable variability, and tested to ensure they behave as expected
when conditions aren't optimal.

In particular it is important to check that timeouts work as configured, and that your end user's experience is maintained.

WireMock Cloud stubs can be served with a fixed or random delay, or can be "dribbled" back in chunks over a defined time period.

## Fixed delay

A fixed delay straightforwardly adds a pause for the specified number of milliseconds before serving the stub's response.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/fixed-delay.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=3383378c11bb976a18ceef3b58f7234e" title="Fixed delay" width="50%" data-path="images/screenshots/fixed-delay.png" />

## Random delay

Random delay adds a random pause before serving the response. Two statistical distributions are available:

### Uniform

<img src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/random-uniform-delay.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=bf5593c2daf7a8b629bffe73c5d843aa" title="Random uniform delay" width="50%" data-path="images/screenshots/random-uniform-delay.png" />

### Log normal

<img src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/random-lognormal-delay.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=293272cba3883c23a3b8f4695fe16c0a" title="Random lognormal delay" width="50%" data-path="images/screenshots/random-lognormal-delay.png" />

## Chunked dribble delay

Chunked dribble delay flushes the response body out in chunks over the total defined period:

<img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/chunked-dribble-delay.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=f13baa40b56a97985b9b9a2911297bd1" title="Chunked dribble delay" width="50%" data-path="images/screenshots/chunked-dribble-delay.png" />

## Delays and proxying

Fixed or random delays can be added to proxy responses in addition to direct responses, however chunked delays cannot at present.

