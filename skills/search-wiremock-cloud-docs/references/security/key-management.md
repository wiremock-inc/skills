> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Key management

> Securing your mock API integrations.

When using external integrations with WireMock Cloud, the communication between WireMock Cloud and these integrated services
must be secured.

WireMock Cloud provides the means to generate, moderate and attach asymmetric keys to facilitate this secure communication.

## Usage

For a key to be of use it must be attached to something that requires secure authentication with a third party.
Currently, the only place in WireMock Cloud where a key can be attached is a mock API's [OpenAPI Git integration](/openAPI/openapi-git-integration).

Instructions for attaching a key to an OpenAPI Git integration can be found [here](/openAPI/openapi-git-integration#configuring-your-git-integration).

## Managing your keys

To view the keys you have access to, navigate to the security page in WireMock Cloud via your account avatar in the top
right and click on the `Keys` tab.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/security-page-navigation.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=ba024cd9612b4c8f5693a110b2b9b075" alt="Security page navigation" width="263" height="447" data-path="images/screenshots/keys/security-page-navigation.png" />

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/keys-list.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=fe9a984de59a1f1f8b40b30cfa102feb" alt="Keys list page" width="1166" height="835" data-path="images/screenshots/keys/keys-list.png" />

From this page you can create new keys, page between existing keys, and delete keys, as well as search for specific
keys by name.

### Creating new keys

Clicking the `Create new key` button on the main keys page will take you to a new page containing a form to enter the
desired name of the new key.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/create-a-new-key.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=97534a1c360c170fa6b561da829e6dc1" alt="Creating a new key" width="50%" data-path="images/screenshots/keys/create-a-new-key.png" />

Saving this new key will generate a secure key pair, and the public key for this key pair will be displayed.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/edit-a-key.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=b2e93dbc9e5d7d2d0d792bca7df47549" alt="Viewing your new key" width="50%" data-path="images/screenshots/keys/edit-a-key.png" />

This key can then be [attached to other parts of WireMock Cloud](#usage).

The private key is stored in encrypted form and only decrypted briefly when in use via a secure decryption service.

### Moderating existing keys

To view and update a key, click on its name from the main key page.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/navigate-to-a-key.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=82a51dd35c4807fa21a817097d8709e9" alt="Navigating to a key" width="50%" data-path="images/screenshots/keys/navigate-to-a-key.png" />

From here, a key's name can be updated, and the key can be shared with others in your organisation.

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/key-share-button.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=d30d06b2922d78c4ede4d2d13ad8eddd" alt="Key share button" width="50%" data-path="images/screenshots/keys/key-share-button.png" />

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/keys/key-acl-widget.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=0f840ebf9bd1e12e4be20246094eed31" alt="Sharing a key" width="50%" data-path="images/screenshots/keys/key-acl-widget.png" />

