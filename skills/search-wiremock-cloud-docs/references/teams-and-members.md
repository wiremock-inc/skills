> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Teams and Members

> Creating, fetching and deleting teams and team members via the API

## Adding a member to a team

Follow these steps to find a specific user and team, then add the user to the team:

<Steps>
  <Step title="Get our organisation ID">
    Follow the steps in [finding your organisation ID](/organisation-info-and-members#finding-your-organisation-id) to retrieve
    your organisation's ID.
  </Step>

  <Step title="Find the ID of the team">
    List the organisations in your team by calling [get all teams in an organisation](/api-reference/teams/get-all-teams-in-an-organisation),
    then find the team you wish to use and read the `id` field.
  </Step>

  <Step title="Find the user">
    Find the user you wish to add to the team using [get users in an organisation](/api-reference/organisations/get-users-in-an-organisation).
    You can optionally pass the query parameter `q` which will filter the results to those whose username or email address
    at least partially matches the value.
  </Step>

  <Step title="Add the user to the team">
    Taking the data captured from the previous steps, call [add team member](/api-reference/teams/add-team-member).
  </Step>
</Steps>

## Removing a member from a team

A user can be removed from a team by first following the data collection steps described above, then calling
[delete a team member](/api-reference/teams/delete-a-team-member).

