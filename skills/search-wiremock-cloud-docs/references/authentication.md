> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication

> How to make authenticated calls to the WireMock Cloud API

## Getting your API token

Each WireMock Cloud user has their own API token which can be found in the [account security page](https://app.wiremock.cloud/user/security).
Copy this token value and make a note of your username, which is usually your email address.

## Making an authenticated call

The WireMock Cloud API uses HTTP Basic authentication, where the username is your username and the password is your API key.

HTTP Basic authentication is achieved by setting the value of the `Authorization` header to `<username>:<password>` base64 encoded.
However, nearly all HTTP clients will construct this for you, taking these two parameters as inputs e.g. curl:

```bash  theme={null}
curl -u 'jeff@example.com:aaaabbbbcccddd11122233' \
  https://api.wiremock.cloud/v1/users/self
```

<Note>
  You can try particular API calls from within the API reference docs by pasting your username and token into the security fields.
  Since you're hitting live API be careful when making calls to endpoints that can modify data (anything that's a POST, PUT or DELETE)
  as this will affect the change in your account.
</Note>

