> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Integration with WireMock Cloud

> Log in to your WireMock Cloud account in the IDE and create mock APIs from your local files

This IDE plugin provides support for various WireMock OSS features as well as integration with WireMock Cloud.

## Install the WireMock plugin

The plugin is available on the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23695-wiremock).

1. Press <kbd>⌘Сmd</kbd><kbd>,</kbd> on Mac or <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>S</kbd> on other platforms to open settings and then select **Plugins**.
2. Open the **Marketplace** tab, find the *WireMock* plugin, and click **Install** (restart the IDE if prompted).

## Setup

The WireMock plugin comes with features that utilize users' existing WireMock Cloud accounts and integrates local
files with them, e.g. creating remote mock APIs from local stub mappings.

So, if you have a WireMock Cloud account and want to connect to it and use Cloud specific features, head to the plugin settings
at **Settings | Tools | WireMock** and log in to your account.

Otherwise, no specific setup is required.

## Log in to WireMock Cloud

When WireMock is first installed, it is necessary to log in to your WireMock Cloud account, in order to be able to use related features.

Logging in can happen at two different locations: via an editor notification after opening stub mappings files, or from the plugin's settings UI.

<Note>
  Credentials are stored safely by the IDE (on the IDE level), so

  <ul>
    <li>they are completely separate from any WireMock CLI installation on the system,</li>
    <li>and if you are using the plugin in multiple IDEs, you have to log in in each of them.</li>
  </ul>
</Note>

### From the editor notification

Upon opening a stub mapping JSON file, the following notification appears at the top of the editor.
It provides a way to create an account if you haven't already, or to use your existing account.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-login-editor-notification.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=284e5e1576fb96f971c48b21798814fa" alt="WireMock Cloud editor notification when not logged in" width="991" height="203" data-path="images/ides/jetbrains/wiremock-cloud-login-editor-notification.png" />

To start the login process, click on the **Log in** link. This performs two things:

* shows a balloon popup with your verification code
* opens the login page in your web browser showing you a verification code

In case the page would not open, you can copy the verification URL from the popup.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-authentication-balloon.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=8301dd6f565308f169198a380301cd3a" alt="WireMock Cloud authentication confirmation balloon" width="411" height="167" data-path="images/ides/jetbrains/wiremock-cloud-authentication-balloon.png" />

Make sure that the two codes match, then confirm the device code. In a few seconds the IDE will show you another balloon
confirming your login.

### From the plugin settings

You can also log in to your account via the plugin settings at **Settings | Tools | WireMock**.
The flow is similar to the one described in the previous section, but it is handled entirely on the settings UI,
and you also have the option to **Cancel Login**.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-settings-logged-out.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=231321a6d36a7685f9c20af1a97ea1f7" alt="WireMock Cloud settings not logged in" width="614" height="148" data-path="images/ides/jetbrains/wiremock-cloud-settings-logged-out.png" />

When the login is successful, the UI will show you the email address you are logged in with,
or will notify you if a problem occurred during the login.

#### Use with On-Premise Edition

The plugin also supports work with the on-premise edition of WireMock Cloud. To turn on this feature, enable
the **Use with On-Premise Edition** option, update the necessary configuration values, and log in.

If you are already logged into a different installment of WireMock Cloud, make sure to log out, save the settings,
and log in again.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-settings-on-premise.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=51a8e18eee89c8205ab77fe6e6c24a1a" alt="WireMock Cloud settings on-premise" width="677" height="362" data-path="images/ides/jetbrains/wiremock-cloud-settings-on-premise.png" />

## Create mock APIs and import stubs

If you want to convert local stub mappings to remotely hosted WireMock Cloud mock APIs, you can do so: open a stub mapping file,
then click on the **Create mock API** link in the top notification,
or the <img src="https://resources.jetbrains.com/help/img/idea/2025.3/app-client.expui.general.export.svg" style={{display: 'inline-block', margin: 'inherit'}} /> icon
in the floating toolbar.

<img src="https://mintcdn.com/wiremockinc/3dfMUJo65AXlEMtQ/images/ides/jetbrains/wiremock-cloud-create-mock-api.png?fit=max&auto=format&n=3dfMUJo65AXlEMtQ&q=85&s=48034433623a5dc4dfeb786cc97e9f6a" alt="WireMock Cloud create mock API options" width="985" height="219" data-path="images/ides/jetbrains/wiremock-cloud-create-mock-api.png" />

<Note>
  These actions are shown only when you are logged in to a WireMock Cloud account.
</Note>

This will display a dialog (detailed in the sections below) to specify the properties of the new mock API.

Submitting the dialog creates an empty, remote mock API with the specified name and custom hostname, and immediately imports/uploads the
stubs from the open mapping file into that new API.

### Mock API properties and types

When you initiate the mock API creation, you are presented with a dialog to specify the API name, an optional custom hostname
and the type of the API to create.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-create-mock-api-dialog.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=29fb54d18eec6e58ff07fef9e8e99e8a" alt="WireMock Cloud create mock API dialog" width="486" height="219" data-path="images/ides/jetbrains/wiremock-cloud-create-mock-api-dialog.png" />

The following API types are supported:

* Unstructured (WireMock)
* REST
* [GraphQL](/graphql/overview) (+ non-federated schema)
* [gRPC](/grpc/overview) (+ descriptor file)

If you choose GraphQL or gRPC you must also upload a schema/descriptor file with them. Creating a mock API without them is not permitted.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-create-mock-api-dialog-graphql.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=5ab27c2febbfa056ab75fe5dace34e5c" alt="WireMock Cloud create mock API with GraphQL" width="486" height="325" data-path="images/ides/jetbrains/wiremock-cloud-create-mock-api-dialog-graphql.png" />

### Completion of the API creation

The creation of the mock API and data upload into it is performed in two or three separate phases depending on the API type:

* API creation and stub upload for Unstructured and REST,
* API creation, stub upload and schema/descriptor upload for GraphQL and gRPC

Thus, when all phases finish without any issue, a separate balloon notification appears for each phase.
The first one also provides a link with which you can easily open the new API in your browser.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-cloud-create-mock-api-successful.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=64fe9b6c46f9b81579fa0ebce3c160f4" alt="WireMock Cloud create mock API with GraphQL" width="409" height="200" data-path="images/ides/jetbrains/wiremock-cloud-create-mock-api-successful.png" />

If any phase fails for any reason, notifications with appropriate messages will let you know of the failure and the reason of it.

## Import stubs into existing mock APIs

Besides uploading stubs into newly created APIs, you can also upload them into APIs that already exist in your WireMock Cloud account.
You can do so by opening a stub mapping file, then clicking on the
<img src="https://resources.jetbrains.com/help/img/idea/2025.3/app-client.expui.general.upload.svg" style={{display: 'inline-block', margin: 'inherit'}} /> icon in the floating toolbar.

<img src="https://mintcdn.com/wiremockinc/3dfMUJo65AXlEMtQ/images/ides/jetbrains/wiremock-cloud-import-stubs-into-existing-api.png?fit=max&auto=format&n=3dfMUJo65AXlEMtQ&q=85&s=594001de82ac2574e7b1f61f51f0e084" alt="WireMock Cloud import stubs into existing mock API options" width="999" height="220" data-path="images/ides/jetbrains/wiremock-cloud-import-stubs-into-existing-api.png" />

<Note>
  This action is shown only when you are logged in to a WireMock Cloud account.

  This feature adds the uploaded stubs to the target mock API without deleting existing stubs.
</Note>

In the appearing dialog you can find and select the target API to upload stubs into.

<img src="https://mintcdn.com/wiremockinc/3dfMUJo65AXlEMtQ/images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog.png?fit=max&auto=format&n=3dfMUJo65AXlEMtQ&q=85&s=7b520f213e84c76fe44d7d9119998ff1" alt="WireMock Cloud select mock API dialog" width="836" height="544" data-path="images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog.png" />

### Search

When opening the dialog, it displays all available mock APIs. After that you can perform searches with arbitrary query strings (it is case-insensitive)
either by clicking the <img src="https://resources.jetbrains.com/help/img/idea/2025.3/app-client.expui.general.search.svg" style={{display: 'inline-block', margin: 'inherit'}} /> button or by hitting <kbd>Enter</kbd>.

It looks for matches in APIs' names, base URLs and descriptions too. (Showing descriptions is not yet supported.)

If you'd like to reset the results and see all available mock APIs, perform a search with an empty string.

### Mock APIs list

The matching mock APIs are listed in this table with their names, base URLs and types shown.

Each result page shows up to 20 items (that value is not customizable), and the table allows selecting at most 1
mock API as the target. If no API is selected, the dialog cannot be OKed.

On top of initiating the stub import using the **OK** button, double-clicking on a mock API also does the same.

To locate an API easier on the current page, you can use speed search: click somewhere in the table, then start typing.
When there is a match, the first matching row will be selected.

<img src="https://mintcdn.com/wiremockinc/3dfMUJo65AXlEMtQ/images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog-speed-search.png?fit=max&auto=format&n=3dfMUJo65AXlEMtQ&q=85&s=91651c77fecd60d37721557b05bdf694" alt="WireMock Cloud select mock API speed search" width="837" height="300" data-path="images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog-speed-search.png" />

### Pagination

This component lets you navigate through the current result set. It supports moving to the **First**, **Previous**, **Next** and **Last** pages when applicable,
as well as to arbitrary pages.

To initiate the navigation to a specific page, specify a valid page number and hit <kbd>Enter</kbd>. If it is initiated with a number

* less than 1, or a non-integer, it will load the first page
* greater than the total number of pages, it will load the last page

In addition, when an invalid page number is entered, the field displays an appropriate message, for example:

<img src="https://mintcdn.com/wiremockinc/3dfMUJo65AXlEMtQ/images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog-pagination-error.png?fit=max&auto=format&n=3dfMUJo65AXlEMtQ&q=85&s=c8109fe4f94eb4ce13ad591455b16ddf" alt="WireMock Cloud select mock API pagination error" width="841" height="183" data-path="images/ides/jetbrains/wiremock-cloud-select-mock-api-dialog-pagination-error.png" />

### Initiating the stub import

When the dialog is OKed, the stub import begins, and the same logic, including handling failure scenarios,
is performed as when uploading stubs via the [Create mock APIs and import stubs](#create-mock-apis-and-import-stubs) feature.

