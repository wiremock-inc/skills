> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Product Usage Data

> Get data about your organisation's use of the product

<RequestExample>
  ```
  GET https://api.wiremock.cloud/v1/subscriptions/{subscriptionId}/usage
  Authorization: Token <api-key>
  Accept: application/json
  ```
</RequestExample>

<ResponseExample>
  ```json  theme={null}
  {
    "usage": {
      "id": "kl1g9",
      "currentPeriodStart": "2024-08-01T13:50:48.988681Z",
      "currentPeriodEnd": "2025-08-01T13:50:48.988681Z",
      "stubCalledCount": 22309,
      "exportCalledCount": 30,
      "organisationMemberCount": 15,
      "invitationCount": 0,
      "seatLimit": null,
      "totalMockApiCount": 158,
      "totalDataSourceCount": 9,
      "ownMockApiCount": 0,
      "teamMockApiCount": 0,
      "collaboratorCount": 0,
      "totalSeatCount": 15,
      "teamMemberCount": 15,
      "totalTeamCount": 15
    }
  }
  ```
</ResponseExample>

You can use the API to retrieve various metrics about your organisation's use of the product. This corresponds to the data
you can see on the [usage page](https://app.wiremock.cloud/account/usage) in the app.

## Getting usage data

Usage data is associated with your organisation's subscription. Follow these steps to find the subscription ID and then use this
to retrive product usage data:

<Steps>
  <Step title="Get our user account">
    first getting our own user account by calling [get self](/api-reference/users/get-self), which will return
    a redirect to our user account resource. Follow this redirect to retrieve user account details and from here get the organisation ID.
  </Step>

  <Step title="Get the organisation">
    Using the organisation ID from the previous step call [get organisation](/api-reference/organisations/get-organisation-by-id)
    using the ID as the path parameter. This will return organisation information including the subscription ID, which we
    record for the next step.
  </Step>

  <Step title="Get product usage for the subscription">
    We can then use the subscription ID as the path parameter when calling [get usage](/api-reference/usage/get-usage) to get the actual usage data.
  </Step>
</Steps>

