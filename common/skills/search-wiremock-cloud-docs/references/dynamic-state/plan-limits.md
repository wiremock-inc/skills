> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Dynamic State - Plan Limits

> Limitations of your dynamic state usage.

State values are ephemeral; they are stored in a Least Recently Used cache, and whilst WireMock Cloud makes a best
effort attempt to maintain them no guarantee is made about their survival.

In order to prevent resource exhaustion we apply some limits.

Any state value cannot exceed 100,000 characters.

On Enterprise plans, up to 100,000 values can be defined before the least recently used values start being ejected from
the store.

On other plans with Dynamic State enabled only 100 values are maintained in the store.

