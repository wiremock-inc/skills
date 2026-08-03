> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Recording via the CLI

> How to use the WireMock CLI to record stubs from private endpoints

<Note>
  Recording gRPC APIs is currently only supported by the `record-many` command.
  See [here](/cli/multi-domain-recording#recording-grpc-services) for details.
</Note>

The CLI offers a convenient way to record stubs from endpoints that are accessible from the computer running the CLI,
but not accessible from the internet. Run:

```shell  theme={null}
wiremock record http://private-endpoint
```

At the end of your recording you will be asked to choose the Mock API to which you would like to save the recorded
stubs, or create a new Mock API.

If you know the ID of the Mock API you want to save to, you can skip the prompt by passing it as an argument:

```shell  theme={null}
wiremock record http://private-endpoint --to=cloud:<mock_api_id>
```

where `<mock_api_id>` is the ID of the Mock API that should receive the recorded stubs. At present you can get that
value by browsing into a Mock API at [https://app.wiremock.cloud](https://app.wiremock.cloud) and extracting it from the URL - for instance in the URL
`https://app.wiremock.cloud/mock-apis/33eye3l9/stubs/1e0d7dc0-06a0-49a2-81a7-f5d6a40bfa3d`, the ID is `33eye3l9` so you
should record as so:

```shell  theme={null}
wiremock record http://private-endpoint --to=cloud:33eye3l9
```

This will be made easier in future versions!

The CLI will then run a proxy server bound to [http://localhost:8000](http://localhost:8000). Requests to this endpoint will be proxied to the
endpoint you want to record from. When you have finished the journey you want to record, press `<enter>` to save the
stubs to your Mock API in WireMock Cloud and the CLI will exit.

You can specify the port the server should listen on using `-p` or `--reverse-proxy-port`:

```shell  theme={null}
wiremock record http://private-endpoint --to=cloud:33eye3l9 \
  --reverse-proxy-port=8080
```

## Importing recordings as you go along

By default, all the recorded requests are held in memory, and sent to the destination Mock API in WireMock Cloud at the
end of the recording session.

This may not be desirable; if you are doing a long recording session this may be prone to losing too much work. If you
are doing a very large recording session the resulting import may be too large for WireMock Cloud (or other intermediate
infrastructure) to cope.

You may use the `--max-batch-requests` option to specify the maximum amount of requests to import into the destination
Mock API in a single request.
Given a max batch of N requests, an import to the mock API will occur for every N requests recorded.
This requires you to specify the ID of the Mock API you want to save to via the `--to` option when launching the session.

The `--max-batch-bytes` option is also available if you need control over the exact amount of bytes that can be sent in
a single request to the destination Mock API.
Given a max batch of N bytes, an import to the mock API will occur for every N bytes recorded.
Note, if a single recorded request exceeds the maximum number of bytes, this request will still be sent (in a batch of
one).
Like `max-batch-requests`, this option requires you to provide a value to the `--to` option when launching the session.

## Hostname rewriting

Often API responses contain absolute links and other content that refers to the domain name of the API's origin.
When recording an API this can be undesirable as the local proxy is different from the API being recorded, and thus any
client following such a link would make its next request directly to the proxy target rather than the local CLI running
the proxy.

To remedy this issue, the Record command has **hostname rewriting enabled by default**, which will replace any instances
of the proxy target's domain name and port in the response headers or body with the local proxy's domain name and port.

If this is not the behaviour you want when recording, you can turn off hostname rewriting using the `--no-rewrite-origin-hostname`
flag on the `record` command:

```shell  theme={null}
wiremock record http://private-endpoint --no-rewrite-origin-hostname
```

## Advanced Recording

The WireMock CLI accepts a configuration file to control how stubs are recorded:

```shell  theme={null}
wiremock record http://private-endpoint --import-config-file=<path>
```

The format of this file is documented in the [advanced recording configuration page](/cli/recording-configuration).

## Recording with Mutual TLS

If you need to record from an API that authenticates clients with mutual TLS, the CLI can present your private client
certificate in one of two ways:

### Via a PEM file

If you have a file containing a PEM encoded RSA private key and X509 certificate, you can provide it as so:

```shell  theme={null}
wiremock record http://mutual-tls-endpoint --to=cloud:33eye3l9 \
  --client-certificate=/path/to/file.pem
```

A PEM encoded file should look something like this:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHIpsyRDeM1lFQ
<multiple lines of base64 encoded data>
GhxuZ3ceXiqwvhH8Yt5gNs0=
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIDrzCCApegAwIBAgIUR24W6NZN7xPwSqc59usFQ37HPYswDQYJKoZIhvcNAQEL
<multiple lines of base64 encoded data>
dHhXPaefkEhrsUbnXGYRfwQhf4SzdYCMCJno7KKsNn6RLIo=
-----END CERTIFICATE-----
```

### Using a PKCS 12 certificate store

Keeping a private key in PEM format is a security risk, so we also support supplying your client certificate in a
password protected PKCS 12 store as so:

```shell  theme={null}
wiremock record http://mutual-tls-endpoint --to=cloud:33eye3l9 \
  --client-certificate-store=/path/to/file.pkcs12
```

You will be challenged for a password to decrypt the store and the private key. The same password must be able to
decrypt both.

## Non-interactive Recording Sessions

The WireMock CLI `record` command supports running in non-interactive mode, making it ideal for
CI/CD pipelines and automated environments where user interaction is not possible or desired. See the
[Non-interactive Recording](/cli/non-interactive-recording) for more details.

