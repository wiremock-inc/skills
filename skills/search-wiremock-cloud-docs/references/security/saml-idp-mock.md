> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# The SAML Identity Provider Mock

> How to mock a SAML Identity Provider

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/saml-logo.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=4169234fd1585d9dda7b736c6848d523" alt="SAML IDP" width="799" height="278" data-path="images/saml-idp/saml-logo.png" />

These instructions will help you set up a SAML Identity Provider Mock in your WireMock Cloud account.

The SAML IDP Mock is a template that simulates a SAML Identity Provider (IdP). It
generates signed SAML responses with configurable user attributes, making it suitable
for testing SAML-based SSO integrations without needing a real IdP.

Instructions are provided for using it as an Auth0 Enterprise Connection, but should be
broadly applicable to use with any other Service Provider (SP).

## Setting up the mock

To set up the SAML Identity Provider Mock in your WireMock Cloud account, follow these steps:

1. Log in to you [WireMock Cloud](https://app.wiremock.cloud/mock-apis) account.
2. Click **Create new mock API**.
3. On the `Choose protocol` screen, choose `Template library`.

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/template-library.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=e3b403e5d1c3e4488bcc43e8d5a1e6c0" alt="Choose Template" width="1076" height="841" data-path="images/saml-idp/template-library.png" />

4. On the template library screen, search for `SAML` and click **Create Mock API** on the `SAML IDP` template.

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/search-saml.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=b0049d9f3d779d59ad49340d6c43469b" alt="Search Templates" width="1081" height="701" data-path="images/saml-idp/search-saml.png" />

5. Give your mock API a name and click **Continue**.
6. This will create the mock API from the template in your WireMock Cloud account.

## How it works

The template provides an interactive web UI with a three-step flow:

1. **Instructions** (`/`) — Setup guide for connecting the mock IdP to your Service Provider (e.g. Auth0)
2. **Login** (`/login`) — A form to configure the post-back URL, email address, and optional extra SAML attributes
3. **Send Response** (`/send-response`) — Builds a signed SAML response and POSTs it back to your SP's ACS URL

The mock IdP also serves its X.509 signing certificate at `/certificate.pem`.

## SAML response structure

The response includes:

* **Issuer** — mock API's base URL
* **Subject** — NameID using email (format: `emailAddress`)
* **Conditions** — NotBefore (now - 1 min), NotOnOrAfter (now + 5 min), with audience from the SAML request
* **Attributes** — `email` attribute plus any extra `<saml:Attribute>` tags from the login form
* **AuthnStatement** — `PasswordProtectedTransport` context class
* **Signature** — SHA-256 digest, RSA-SHA256 signature, enveloped signature transform

## Setup

To set up the SAML Identity Provider Mock as an Enterprise Connection, copy the base URL
of the mock API and open it in your browser.  You should see a page with instructions for
setting up the connection.

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/base-url.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=869e80818ce672eae86b1f77ff9d487f" alt="Copy Base URL" width="1135" height="124" data-path="images/saml-idp/base-url.png" />

You will see the following instructions:

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/instructions.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=f36e367ba45fc46f6c11ea6a34be1894" alt="Instructions" width="670" height="621" data-path="images/saml-idp/instructions.png" />

1. Download the signing certificate from `/certificate.pem`
2. In Auth0, navigate to **Authentication** > **Enterprise**, click **SAML** > **Create**
3. Set **Sign In URL** to `<mock api base url>/login`
4. Upload the certificate from step 1
5. Toggle off **Enable Sign Out** and **Sign Request**
6. Click **Create**

In the `Login Experience` tab you should specify your domain in the `Identity Provider domains` field
and remember to toggle on the applications you want to associate with this connection in the `Applications` tab.

## Using with your app

1. Login to your application using an account with an email address that matches the domain you specified in the connection setup.
2. This should recognize the connection associated with the domain and redirect you to the `/login` page of the mock IdP.
3. This will display the following form:

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/login-form.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=688532ab8fd6b2b5c2903732a16509cb" alt="Login Form" width="662" height="1001" data-path="images/saml-idp/login-form.png" />

1. Fill out the post-back URL as defined by your IDP.  **This is a required field**. This is likely to be the same
   across all authentication requests for the same domain/connection.  If this is the case you could update the response template to
   hardcode this value.
2. Enter the email address of the user you want to authenticate. **This is a required field**.
3. The `Extra attribute(s)` allows you to send arbitrary extra `<saml:Attribute>` tags.
   It is important to remove all whitespace to ensure SAML hashing and signing work correctly.  For example

```xml  theme={null}
<saml:Attribute Name="groups"><saml:AttributeValue>admins</saml:AttributeValue><saml:AttributeValue>developers</saml:AttributeValue><saml:AttributeValue>finance</saml:AttributeValue></saml:Attribute>
```

Once you have filled out the form, click on the `Build SAML Response` button. This will
take you to the `/send-response` page of the mock IdP, showing the SAML response that was built.

<img src="https://mintcdn.com/wiremockinc/kyjqjQXnKn13jeNt/images/saml-idp/saml-response.png?fit=max&auto=format&n=kyjqjQXnKn13jeNt&q=85&s=e0933f7d77ea8c5a738709c0692293fd" alt="SAML Response" width="668" height="1259" data-path="images/saml-idp/saml-response.png" />

This form shows you the SAML response that was built along with the parsed values for you to use for debugging if required.
Click on the `Send SAML Response to Service Provider` button to send the response back to your SP.

You should then be authenticated and redirected back to your application.

## Questions and feedback

If you're not sure how something works or have a suggestion for improving this simulation, please get in touch with us
via [info@wiremock.io](mailto:info@wiremock.io) or the chat widget.

