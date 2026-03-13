> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Cryptographic Helpers

> Using helpers to perform cryptographic operations

## Hashing

You can create a hash of some text using the `hash` helper.

```handlebars  theme={null}
{{#hash algorithm='sha-256' encoding='hex'}}text to hash{{/hash}}
```

The output of the helper is a binary encoded string.
The encoding used is determined by the `encoding` option supplied to the helper.
Supported encoding values are `hex` and `base64`.

The `algorithm` option determines the hashing algorithm that will be applied to the input text.
Supported algorithm values are:

* `sha-1`
* `sha-224`
* `sha-256`
* `sha-384`
* `sha-512`
* `sha3-224`
* `sha3-256`
* `sha3-384`
* `sha3-512`
* `md2`
* `md5`

### Examples

SHA-256 hex encoding:

```handlebars  theme={null}
{{#hash algorithm='sha-256' encoding='hex'}}text to hash{{/hash}}
```

will output `119e3f0d28cf6a92d29399d5787f90308b6b87670d8c2386ec42cb36e293b5c4`

***

MD5 base64 encoding:

```handlebars  theme={null}
{{#hash algorithm='md5' encoding='base64'}}text to hash{{/hash}}
```

will output `J3A5Rbm86ssJVG0uEDrTYA==`

## Signing

You can digitally sign data using the sign helper. This uses the RSA private key\
configured in your certificate settings to create an `SHA-256` with RSA signature.

```handlebars  theme={null}
{{ sign "text to sign" }}
```

The output of the helper is a Base64-encoded signature by default. You can control the
output encoding using the encoding option. Supported encoding values are `hex` and
`base64`.

The sign helper supports both inline and block forms:

Inline form:

```handlebars  theme={null}
{{ sign "text to sign" }}
```

Block form:

```handlebars  theme={null}
{{#sign}}text to sign{{/sign}}
```

With a variable:

```handlebars  theme={null}
{{{ sign myVariable }}}
```

### Examples

Sign a string literal with default Base64 encoding:

```handlebars  theme={null}
{{{ sign "some data" }}}
```

will output a Base64-encoded RSA signature, e.g. MEUCIQDz...

Sign with hex encoding:

```handlebars  theme={null}
{{{ sign "some data" encoding="hex" }}}
```

will output a hex-encoded RSA signature.

The sign helper is particularly useful when constructing signed documents such as SAML
responses, where you need to sign a computed digest or XML fragment. For example, you
can combine it with the hash helper to create a signed SAML assertion:

```handlebars  theme={null}
{{#assign 'digest'}}{{#hash algorithm='sha-256' encoding='base64'}}content to
hash{{/hash}}{{/assign}}
{{#assign 'signedInfo'}}...{{digest}}...{{/assign}}
{{ sign signedInfo }}
```

## X.509 Certificate

You can output the X.509 certificate configured in your certificate settings using the
`x509Certificate` helper. This is useful when building signed documents like SAML
responses that need to include the signing certificate.

```handlebars  theme={null}
{{ x509Certificate }}
```

The output format is controlled by the format option. Supported format values are `pem`
(default) and `base64`.

### Examples

Output the certificate in PEM format (default):

```handlebars  theme={null}
{{ x509Certificate }}
```

will output the full PEM-encoded certificate including headers:

```
-----BEGIN CERTIFICATE-----
MIIBkTCB+wIGAZO...
-----END CERTIFICATE-----
```

Output the raw Base64-encoded certificate (without PEM headers):

```handlebars  theme={null}
{{ x509Certificate format="base64" }}
```

will output just the Base64-encoded certificate bytes, e.g. `MIIBkTCB+wIGAZO...`

This is useful when embedding the certificate inside an XML document such as a SAML
response, where PEM headers are not required:

```handlebars  theme={null}
<X509Certificate>{{ x509Certificate format="base64" }}</X509Certificate>
```

## Base64 Inflate

You can decode a Base64-encoded, DEFLATE-compressed string in a single operation using
the `base64Inflate` helper. This is primarily designed for decoding SAML requests that
have been compressed and encoded according to the SAML HTTP-Redirect binding
specification.

```handlebars  theme={null}
{{ base64Inflate request.query.SAMLRequest }}
```

SAML requests sent via the HTTP-Redirect binding are first DEFLATE-compressed and then
Base64-encoded. Decoding this requires Base64 decoding followed by DEFLATE
inflation. This helper provides these two options in one convenient helper.

The helper accepts a single parameter: the Base64-encoded, DEFLATE-compressed string.
This is typically a query parameter from the incoming request.

Given a valid Base64-encoded, DEFLATE-compressed SAML AuthnRequest in the SAMLRequest
query parameter, this will output the decoded XML, e.g.:

```xml  theme={null}
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"    
                    Destination="https://example-destination.wiremockapi.cloud/login"    
                    ID="_b9ef70230dj5972308i121395cbe9f4a"    
                    IssueInstant="2026-02-09T11:56:42Z"    
                    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
                    Version="2.0">
    <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:auth0:example:connection-id</saml:Issuer>
</samlp:AuthnRequest>
```

