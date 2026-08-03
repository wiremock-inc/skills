> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Configuring the WireMock CLI

> Managing the configuration of your local WireMock CLI installation

The WireMock CLI provides a `config` subcommand that allows you to configure the behavior of your CLI installation.

Configuration values can be retrieved using `wiremock config get <key>`, set using `wiremock config set <key> <value>`,
and unset using `wiremock config unset <key>`.
You can clear all configured keys by executing `wiremock config clear`.
Available config keys that you can set are [api\_token](#configuring-your-api-token) and
[api\_endpoint](#configuring-your-api-endpoint).

For comprehensive documentation of how each config command works, in the CLI, you can append a `-h` or `--help` to the
end of any subcommand to view the command's help text.
For example, `wiremock config set -h`.

## Configuring your API token

Your API token is used to authenticate with WireMock Cloud when performing actions like [recording](/cli/recording) or
[managing your mock APIs](/cli/mock-apis).
Setting your API token using the `config` subcommand is an alternative to [the login command](/cli/overview#login).
To set your API token, execute the following command

```shell  theme={null}
wiremock config set api_token <API_TOKEN>
```

with `<API_TOKEN>` replaced with your API token, available at [https://app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security).

## Configuring your API endpoint

<Tip>
  Configuring your WireMock CLI installation to use a custom API endpoint is only relevant to customers using WireMock
  Cloud's on-premise edition. To learn more, [contact the WireMock team today](https://www.wiremock.io/contact-now) to
  discuss an enterprise plan for your organisation.
</Tip>

The CLI's configured API endpoint is the base URL of the API server that the CLI uses to perform actions like
[recording](/cli/recording) or [managing your mock APIs](/cli/mock-apis).
By default, this endpoint is [https://api.wiremock.cloud](https://api.wiremock.cloud), the endpoint used by WireMock Cloud's SaaS edition (more
information on using WireMock Cloud's API can be found in the [API reference](/api-reference)).
To set your API endpoint to a custom URL, execute the following command

```shell  theme={null}
wiremock config set api_endpoint <API_ENDPOINT>
```

with `<API_ENDPOINT>` replaced with your API endpoint URL. The API endpoint for your on-premise installation of WireMock
Cloud will have the format `https://api.wiremock.<your_subdomain>`. Consult your system administrator if you are unsure
of the exact URL to use.

<Warning>
  If you have set your API endpoint to a custom endpoint, `wiremock login` will no longer work. Please authenticate by
  [setting your API token using the config subcommand](#configuring-your-api-token) instead.
</Warning>

