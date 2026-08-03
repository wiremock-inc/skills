> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Mock APIs

> Creating, updating, deleting and permissioning mock APIs via the API.

## Creating and permissioning a new mock API

Follow these steps to create a mock API then grant a single user permission to use it:

<Steps>
  <Step title="Create a new mock API">
    Start by calling the [create new mock API](/api-reference/mock-apis/create-a-new-mock-api) endpoint, specifying
    the name, type and hostname of the API.

    The type can be left blank for an unstructured, or it can be `grpc` or `openapi`.

    The hostname is the friendly unqualified domain name used in the base URL. It is optional, and if omitted the
    generated ID for the mock API will be used in the domain name.

    Save the mock API's ID from the response.
  </Step>

  <Step title="Get the ACL candidates">
    Follow the `mockApi.links.acl` link in the response gained in the previous step, which will return
    [ACL candidates](/api-reference/access-control/get-acl-candidates).

    From within the returned data, find the user to whom you wish to grant access to the mock API and follow the link to the user resource.
    Save the user's ID.
  </Step>

  <Step title="Grant access to the user">
    Call [update an entity's ACL](/api-reference/access-control/update-an-entitys-acl), setting the following parameters:

    `entityCollection` = `mock-apis`

    `entityId` = \<the mock API ID>

    `subjectType` = `user`

    `subjectEntityId` = \<the user's ID>

    The body must contain the role to be granted e.g. `mock_api_editor`.
  </Step>
</Steps>

Similar steps can be taken when adding a team rather than a single user to the permissions.

