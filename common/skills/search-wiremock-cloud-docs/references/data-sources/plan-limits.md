> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Data Sources - Plan Limits

> Limitations of your data source usage.

WireMock Cloud applies limits to data sources dependent upon the plan your organisation is subscribed to.

On the WireMock Cloud free plan, an account is limited to a maximum of 3 data sources.
Each data source can contain up to 100 rows and each row must not exceed 10KB in size.
During the enterprise trial period, this limit is increased to 1000 rows with a maximum row size of 100KB.

To increase the limits applied to your organisation, [contact the WireMock team today](https://www.wiremock.io/contact-now).

## Disabled data sources

If an account/organisation is downgraded to a plan that causes their data sources to exceed the new plan's limits, these exceeding data sources will be disabled.
Any stubs with disabled data sources attached will lose their [data matching abilities](#stub-matching) and [access to the data](#data-source-response-templating) in their response template.
Disabled data sources can be enabled at any time by updating them to fit within the account plan's limits or, of course, by [upgrading to a different plan](https://www.wiremock.io/contact-now).

### Stub Matching

If a stub is using a data source that has been disabled, the stub will no longer [match incoming requests](./overview#custom-stub-matching) if the
`Matches stub only if data is found` tick box is checked on the Stub form. If this tick box is not checked, the stub
will continue to match incoming requests, but the data source will not be queried.

### Data source response templating

If a data source is disabled, any [response templates](./overview#rendering-data-in-response) that are using the data source will no longer be able to access the
data source data. The response template will still be rendered, but the data source data will not be available.

