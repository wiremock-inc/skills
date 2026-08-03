> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Organisation Info and Members

> Getting and updating your organisation information, and managing members

## Finding your organisation ID

<Steps>
  <Step title="Get your own user account">
    Find your org ID on your user account info by calling the [get self](/api-reference/users/get-self),
    ensuring you follow the redirect.
  </Step>

  <Step title="Get the organisation">
    Follow the `organisation` link in the response to get the organisation details.
  </Step>

  <Step title="Read the ID">
    Read the `id` field from the response.
  </Step>
</Steps>

## Updating your organisation name

You can update your organisation's name by calling [update organisation](/api-reference/organisations/update-organisation).

## Removing an organisation member

A user can be completely removed from your organisation by using the
[delete organisation member user](/api-reference/organisations/delete-organisation-member-user) endpoint.

If you need to find the user's ID first you can do so via [get users in an organisation](/api-reference/organisations/get-users-in-an-organisation).

Removing a user from the organisastion won't delete their user account completely but will move them to a new organisation
containing only themselves which is subscribed to the Individual (free) plan.

