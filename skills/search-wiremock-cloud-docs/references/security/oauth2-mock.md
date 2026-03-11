> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# The OAuth2 / OpenID Connect Mock

> Using the OAuth2 / OpenID Connect Mock

<img src="https://mintcdn.com/wiremockinc/9niDaTpLrBsVTNkq/images/oauth-2-logo.png?fit=max&auto=format&n=9niDaTpLrBsVTNkq&q=85&s=575bcf302eaef5ff36ceb83b54cc9598" alt="OAuth2" width="124" height="123" data-path="images/oauth-2-logo.png" />.    &#x20;

This is a simulation of an **OAuth2** / **OpenID Connect** login service that you can use as a **drop-in replacement** for the real thing during testing. It's free to use, and completely stateless so can accommodate virtually any number of concurrent clients (at least until the server runs out of breath!).

Currently the `authorization_code` (server-side web) OAuth2 flow is supported.

## Using with your app

Start by finding the OAuth2 configuration in your app's server-side component. Where this is located
varies from app to app - sometimes it can be found in a configuration file, other times it is set
directly in code. If you're using an SDK from your login service, you may need to override the defaults this provides.

Set the following values:

* Authorization URI: [`https://oauth.wiremockapi.cloud/oauth/authorize`](https://oauth.wiremockapi.cloud/oauth/authorize)

* Token URI: [`https://oauth.wiremockapi.cloud/oauth/token`](https://oauth.wiremockapi.cloud/oauth/token)

* User info URI: [`https://oauth.wiremockapi.cloud/userinfo`](https://oauth.wiremockapi.cloud/userinfo)

* JWKS URI: [`https://oauth.wiremockapi.cloud/.well-known/jwks.json`](https://oauth.wiremockapi.cloud/.well-known/jwks.json)

You can [see here](https://github.com/wiremock/wiremock-cloud-demo-app/blob/master/src/main/resources/application.yml#L8) how this is done in a Spring Boot application.

After that, when you start the login process from your app you should be sent to
a simulated login page, rather than the one belonging to your real provider. You
can log in with any email address and password you like, real or not.

<img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/Screenshot2025-01-16at10.05.25AM.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=2ae582155118b0764dab691986490fb9" alt="" width="864" height="700" data-path="Screenshot2025-01-16at10.05.25AM.png" />

## Questions and feedback

If you're not sure how something works or have a suggestion for improving this simulation, please get in touch with us
via [info@wiremock.io](mailto:info@wiremock.io) or the chat widget.

