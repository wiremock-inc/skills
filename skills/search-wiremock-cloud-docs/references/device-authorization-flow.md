> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock API Device Authorization Flow

> How to use the OAuth 2.0 Device Authorization Flow to authenticate to the WireMock Cloud API

Enterprise customers may wish to interact with the WireMock Cloud API from their own clients using
OAuth 2.0. WireMock Cloud supports the OAuth 2.0 Device Authorization Flow for these customers.

## Requirements

You will need to have requested the creation of a new OAuth Client by WireMock Cloud.

You will need to tell us:

* The maximum time you allow between interactions before the user has to reauthenticate
* The maximum total time you allow between authentications, eve if the user is regularly interacting

## Inputs

* `{client_id}`: The OAuth client (in Auth0, the Application id) provided by WireMock Cloud

### Initiate the Client

```http request theme={null}
GET https://login.wiremock.cloud/.well-known/openid-configuration
Accept: application/json
```

returns:

#### `discover_urls`

```json  theme={null}
{
  "token_endpoint": "{fully_qualified_url}",
  "device_authorization_endpoint": "{fully_qualified_url}",
  "revocation_endpoint": "{fully_qualified_url}"
}
```

### Initiate the Device Authorization Flow

```http request theme={null}
POST {discover_urls.device_authorization_endpoint}
Content-Type: application/x-www-form-urlencoded

client_id={inputs.client_id}&audience=https%3A%2F%2Fapi.wiremock.cloud&scope=openid+email+offline_access
```

returns:

#### `device_authorization`

```json  theme={null}
{
  "device_code": "{random_value}",
  "user_code": "{legible_random_value}",
  "verification_uri": "{fully_qualified_url}",
  "expires_in": 900,
  "interval": 5,
  "verification_uri_complete": "{fully_qualified_url}"
}
```

`expires_in` and `interval` are values in seconds.

### Pass control to the user to authenticate

Something like this should be rendered:

```
Attempting to automatically open the authentication page in your default browser.

Code: {device_authorization.user_code}

If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

{device_authorization.verification_uri_complete}

Waiting for login...
```

if possible, `{device_authorization.verification_uri_complete}` should be opened automatically in
the user's browser.

### Poll for successful authentication

Every `{device_authorization.interval}` seconds until `{device_authorization.expires_in}` seconds have passed you poll
as so:

```http request theme={null}
POST {discover_urls.token_endpoint}
Content-Type: application/x-www-form-urlencoded

client_id={inputs.client_id}&device_code={device_authorization.device_code}&grant_type=urn:ietf:params:oauth:grant-type:device_code
```

You should be returned one of these two responses:

```http response theme={null}
HTTP/2 403 Forbidden
Content-Type: application/json

{
  "error": "authorization_pending",
  "error_description": "User has yet to authorize device code."
}
```

which means "poll again in `{device_authorization.interval}` unless
`{device_authorization.expires_in}` has passed"

or

#### `token_response`

```http response theme={null}
HTTP/2 200 OK
Content-Type: application/json

{
  "access_token": "{access_token}",
  "token_type": "{token_type}",
  "expires_in": 300,
  "refresh_token": "{refresh_token}",
  "id_token": {id_token}
}
```

You can then interact with the API using this request header:

`Authorization: {token_response.token_type} {token_response.access_token}`

### Refresh Tokens

WireMock access tokens are JWTs, and cannot be revoked. Consequently they are short-lived (sub 10
minutes).

In order to avoid having to authenticate regularly, the client may exchange a refresh token (which
can be revoked) for a new access token.

A refresh token, once used, becomes invalid - a new one is returned along with the new access token.
Any attempt to use an invalid refresh token will also invalidate the current valid refresh token,
forcing a reauthentication.

Refresh tokens can be explicitly revoked on logout.

#### Exchanging a refresh token for a new access token

```http request theme={null}
POST {discover_urls.token_endpoint}
Content-Type: application/x-www-form-urlencoded

client_id={inputs.client_id}&refresh_token={token_response.refresh_token}&grant_type=refresh_token
```

returns

##### `token_response`

```json  theme={null}
{
  "access_token": "{access_token}",
  "token_type": "{token_type}",
  "expires_in": 300,
  "refresh_token": "{refresh_token}"
}
```

#### Invalidating a refresh token

```http request theme={null}
POST {discover_urls.revocation_endpoint}
Content-Type: application/x-www-form-urlencoded

client_id={inputs.client_id}&token={token_response.refresh_token}
```

