> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Stateful Endpoint Set

> Assisted Creation of Stateful Mock APIs

The **Create Stateful Endpoint Set** feature in WireMock Cloud automates the creation of pre-configured stateful stubs. This allows for quick setup of RESTful API mocks with built-in request-response handling and state management across multiple HTTP methods.

Using this feature, WireMock Cloud automatically generates:

* **GET, POST, PUT, and DELETE** stubs for the specified resource
* A **default 404 response** for unmatched requests

This feature requires the **REST mock API template**.  It is not available in the Unstructured / Blank mock API template.

## How It Works

You provide:

1. Create a new **REST mock API**

2. Click the **Stateful Set** button near the bottom of the stub list:

   <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/dynamic-state/stateful-set-button.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=bdb444a4900e081d9faa1a4b7903a416" alt="Stateful set button" width="284" height="112" data-path="images/dynamic-state/stateful-set-button.png" />

3. Supply a **POST endpoint page** (e.g., `/users`):

   <img src="https://mintcdn.com/wiremockinc/-wllCbfV1T1IIu-9/images/dynamic-state/stateful-set-post-endpoint.png?fit=max&auto=format&n=-wllCbfV1T1IIu-9&q=85&s=6570667c041646b57ad381620c53183e" alt="Stateful set post endpoint" width="751" height="847" data-path="images/dynamic-state/stateful-set-post-endpoint.png" />

4. Provide a **sample request body** for the `POST`
   e.g.:

   ```json  theme={null}
   {
       "firstName": "Betty",
       "lastName": "Boop",
       "organization": "Finance"
   }
   ```

   <img src="https://mintcdn.com/wiremockinc/-wllCbfV1T1IIu-9/images/dynamic-state/stateful-set-request-body.png?fit=max&auto=format&n=-wllCbfV1T1IIu-9&q=85&s=bc93e618c80ec2ea7984833b1cfd3493" alt="Stateful set request body" width="746" height="844" data-path="images/dynamic-state/stateful-set-request-body.png" />

5. Input a **correlated sample response body** for the given request body
   e.g.:

   ```json  theme={null}
   {
       "contactId": "4",
       "firstName": "Betty",
       "lastName": "Boop",
       "organization": "Finance",
       "created_utc": "2025-02-28T15:58:35Z"
   }
   ```

   <img src="https://mintcdn.com/wiremockinc/-wllCbfV1T1IIu-9/images/dynamic-state/stateful-set-response-body.png?fit=max&auto=format&n=-wllCbfV1T1IIu-9&q=85&s=116c320dce89308d8a2477f09630253c" alt="Stateful set response body" width="743" height="842" data-path="images/dynamic-state/stateful-set-response-body.png" />

6. At the bottom of the dialog, select which operations you'd like stubs to be created for:

   <img src="https://mintcdn.com/wiremockinc/-wllCbfV1T1IIu-9/images/dynamic-state/stateful-set-select-operations.png?fit=max&auto=format&n=-wllCbfV1T1IIu-9&q=85&s=6341e315ef848b13183bcdb9f5908d38" alt="Stateful set target operation selection" width="743" height="508" data-path="images/dynamic-state/stateful-set-select-operations.png" />

7. Click the **Create Stateful set** button:

   <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/dynamic-state/stateful-set-create-button.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=5d953dda682ca12d446938cfba917f46" alt="Create Stateful set button" width="201" height="58" data-path="images/dynamic-state/stateful-set-create-button.png" />

New stubs will be created that are automatically configured with stateful functionality.

* A **POST** stub that creates a new resource in the mock API's stateful memory
* A **GET** stub that lists all of the resources stored in the mock API's stateful memory
* A **GET** stub that retrieves a stored resource by its identifier
* A **PUT** stub that updates the stored data of a resource
* A **DELETE** stub that removes the stored resource
* A **DELETE** stub that removes all stored resources from the mock API's stateful memory
* A fallback **404 response** for unknown requests

You will want to further modify the stubs to better simulate the API's real-world stateful behavior.

