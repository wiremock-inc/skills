> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Versioning

> Mock API Versioning Overview

WireMock Cloud supports versioning of your mock APIs.  This means that as you create and configure your mock APIs, a
version history is kept for each API.  This allows you to easily revert to a previous version of your API, or to
compare the differences between two versions.

## Usage

### Accessing your mock API version history

The version history for your mock API is available on the mock API menu bar.  Click on the `Version history` link to
access the version history.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-menu.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=d09c8372192de1e933818af9ccc5cb1a" alt="Versioning menu item" width="470" height="384" data-path="images/versioning/versioning-menu.png" />

This will take you to the version history page for your mock API where you will be able to see a list of the most recent
commits.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-recent-changes.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=f711b4a0e27eb3ce0ea8b4cbd65960bc" alt="Versioning recent changes screen" width="1079" height="493" data-path="images/versioning/versioning-recent-changes.png" />

### Commits

A commit is a collection of changes to your mock API and is created when you create, modify or delete assets
associated to your mock API - stubs, settings, GraphQL schemas, gRPC definition files, OpenAPI schemas, etc.

Each commit will have a timestamp of when commit was made to the API. If the commit is made by an authenticated user
(as opposed to the system), the user's username will be displayed alongside the commit.

### Changes

Changes are the individual changes that were made to your mock API. To view the changes associated with a commit, click
on the `View changes` link to the right of the commit.  This will display one or more changes highlighting what was
changed and how. For example, the following example shows a change for a stub creation in the Mock API:

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-created.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=8e0db70a8599a274ef7aedc241f23173" alt="Versioning stub created change" width="1084" height="546" data-path="images/versioning/versioning-stub-created.png" />

### Viewing what actually changed

You can click on any of the changes in the list to view the actual changes that were made.  Where possible, this will
show you the diff highlighting what was added or removed.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-created-diff.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=f545a6df9c44ef07d41824a89c1c3cbf" alt="Versioning stub created change diff" width="1060" height="1249" data-path="images/versioning/versioning-stub-created-diff.png" />

In the above example, the left side of the diff shows the stub before the change was made (it didn't exist so this is
empty), and the right side shows the stub after the change was made. (All the stub is marked as 'green' because it was
created in this change)

The diff view is available where we have a text representation of the change.  For binary Mock API assets,
(like [gRPC](../grpc/overview) descriptor files) changes to those files are recorded but the diff view is not available.

### Restoring to a previous version

The buttons above the diff shows the restore actions you can take on either side of the diff.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-diff-actions.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=8d60ade550ea48f0e694a869e58fcd8e" alt="Versioning restore actions" width="1141" height="171" data-path="images/versioning/versioning-diff-actions.png" />

In the example below, the right side of the diff has no action available because it shows the most recent
version of the stub.  The left side of the diff has an action available to restore the change.  Because this change
shows a stub creation, the 'restore' action is to delete this stub.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-created-diff.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=f545a6df9c44ef07d41824a89c1c3cbf" alt="Versioning stub created change diff" width="1060" height="1249" data-path="images/versioning/versioning-stub-created-diff.png" />

Clicking on the `Delete` button will display a confirmation dialog asking if you want to proceed with the deletion.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-mapping-delete-confirmation.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=77e8b6bf21a8b3824c4f4f14a41c574a" alt="Versioning stub delete confirmation" width="511" height="218" data-path="images/versioning/versioning-stub-mapping-delete-confirmation.png" />

Clicking the `No` button will exit the confirmation dialog without deleting the stub.  Clicking the `Yes` button
will 'restore' the change and delete the stub.

Once you have deleted a stub, the stub will no longer be available in your mock API and a new commit will be created
with the stub deletion.  The diff will show the stub as being deleted:

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-deleted.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=bb609ab4cfec839bd1b40978edcd7531" alt="Versioning stub deleted change" width="1061" height="1251" data-path="images/versioning/versioning-stub-deleted.png" />

You will see the button has now changed to `Restore` to allow you to restore the stub.  Clicking on the `Restore`
button will display a confirmation dialog asking if you want to proceed with the restore.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-mapping-restore-confirmation.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=cabd5191fc15f6119e0965987b00b2c1" alt="Versioning stub restore confirmation" width="517" height="224" data-path="images/versioning/versioning-stub-mapping-restore-confirmation.png" />

As before, clicking the `No` button will exit the dialog without restoring the stub.  Clicking `Yes` will restore the
stub and create a new commit with the stub creation.

The same applies to modifying - a new commit will be created with the change.  The diff will show the change from the
previous version to the new version:

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-modified-latest-version.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=4c89c1cc5106f11aa498c43fb4cc765a" alt="Versioning stub modified change - latest version" width="1118" height="889" data-path="images/versioning/versioning-stub-modified-latest-version.png" />

You will notice in the image above that no `Restore` button is available on the right hand side of the diff.  This is
because the right hand side of the diff shows the most recent version of the stub.  The left hand side of the diff has an
`Restore` button available to restore the change.  If the commit you were looking was not the most recent version of the
stub, you will see a `Restore` button on both sides of the diff allowing either side of the diff to be restored:

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-modified-previous-version.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=45532f63d59cee7a61d6fa00e1aebc89" alt="Versioning stub modified change - previous version" width="1090" height="891" data-path="images/versioning/versioning-stub-modified-previous-version.png" />

Versioning is available for mock API stubs, settings, chaos, GraphQL schemas, gRPC definition files and OpenAPI schemas. Updating
any of these assets will create a new commit.  Some commits are created automatically for you.
For example, if you are working on a [REST mock API](../openAPI/openapi) and you have automatic generation of OpenAPI to
stubs enabled. Updating a stub will create a new commit for the change to the OpenAPI and a new commit for the change to
the stub.

### Importing

Importing into your mock API can generate multiple changes in the one commit.  For example, if you imported a file that
created multiple stubs, each of those stub creation changes will be recorded in a single commit.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-import-changes.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=b7c05588bff9e372edb9d4ff81ba8dd0" alt="Versioning import changes" width="1097" height="519" data-path="images/versioning/versioning-import-changes.png" />

## Restoring a Mock API to a previous commit

When you click on the `View changes` link  for a commit, you will see the changes between the commit you have selected
and the previous commit.  This is great for when you want to cherry-pick specific changes and restore individual items
in your mock API.

However, if you want to restore the entire mock API to a previous version, you can do so by clicking on the `Compare with latest`
link next to a commit

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-recent-changes.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=f711b4a0e27eb3ce0ea8b4cbd65960bc" alt="Versioning recent changes screen" width="1079" height="493" data-path="images/versioning/versioning-recent-changes.png" />

This will show you all the changes between the current version of the mock API (the latest commit) and the commit you
have selected.  You can then click on the `Restore all changes` button next to the commit you want to restore to.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-stub-created.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=8e0db70a8599a274ef7aedc241f23173" alt="Versioning stub created change" width="1084" height="546" data-path="images/versioning/versioning-stub-created.png" />

As with and restores, this will create a new commit with all the mock api changes from the selected commit. This will
include any changes to the mock API settings, stubs, chaos, GraphQL schemas, gRPC definition files and OpenAPI schemas.

When you click on the `Restore all changes` button, you will be prompted to confirm that you want to restore the entire
mock API to the selected commit.

<img src="https://mintcdn.com/wiremockinc/J_RGTCQ_EJ6mNjsY/images/versioning/versioning-restore-mock-api-confirmation.png?fit=max&auto=format&n=J_RGTCQ_EJ6mNjsY&q=85&s=ce151c3c9fffd7b40acdc389244a877f" alt="Versioning restore mock api confirmation" width="514" height="226" data-path="images/versioning/versioning-restore-mock-api-confirmation.png" />

Clicking `Yes` will restore the entire mock API to the selected commit and clicking `No` will exit the confirmation dialog
without making any changes.

## Limits

You can read more about [plan limits here](./plan-limits/).

If you have feedback or questions on our Versioning functionality as it evolves, we'd love to hear from you.
Please [get in touch](mailto:support@wiremock.io).

