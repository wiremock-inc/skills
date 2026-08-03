> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Database Connections

> Creating and editing the database connection to your test database

<Tip>
  The database connection feature is currently in **private beta**.  If you would like access to this feature contact us
  via the `Get Support` link in the menu bar
</Tip>

## Creating a database connection

Database connections can be created at the organisation level, meaning that the database connections you create can
be shared among the members of your organisation.

To create a database connection, you must be an administrator of your organisation and your database must be
accessible - either publicly or via our AWS VPC.  If you would like to explore the VPC option please contact us.

To create a database connection:

* Navigate to the Data Sources page.

<img alt="Data source menu item" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-navigate.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=1b64f35035513087e69a7daa9820af54" width="616" height="328" data-path="images/screenshots/data-sources/data-source-navigate.png" />

* Click on the link, `View Connections`

<img alt="View database connections link" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-view-connections.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=786f16134de79de9f3b9c4145b35d0ca" width="593" height="268" data-path="images/screenshots/data-sources/data-source-view-connections.png" />

* Click on the button, `Create new database connection`

<img alt="Create database connection button" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-create-button.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=7a6b3b4911235370c4484e8b25378e09" width="674" height="262" data-path="images/screenshots/data-sources/database-connection-create-button.png" />

* Fill out the form with the details of your database connection

<img alt="Create database connection button" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-create-form.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=71a0aa22d87b60df4bc99178aae0c022" width="1419" height="890" data-path="images/screenshots/data-sources/database-connection-create-form.png" />

The connection details you will need are:

* A name for the connection.  This must be unique across all the database connections in you organisation
* A database type - we currently support `Postgresql`, `MySql`, `Oracle` and `MS SQL Server`
* The hostname for the connection
* The port the database is running on
* The name of the database
* The username used to connect to the database
* The password used to connect to the database

Once you have entered all the details for your database connection you can test that they allow a successful connection
to your database by clicking on the `Test connection` button.

<img alt="Database connection test connection success" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-test-connection-success.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=11dae71a0b87093a32476b3779190191" width="809" height="915" data-path="images/screenshots/data-sources/database-connection-test-connection-success.png" />

If the connection request is unsuccessful, an error message will be displayed.

<img alt="Database connection test connection unsuccessful" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-test-connection-unsuccessful.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=0c263e5f245ecad2d1af9dc99b05b650" width="643" height="108" data-path="images/screenshots/data-sources/database-connection-test-connection-unsuccessful.png" />

* Once you are happy with your database connection details, click on the `Save` button to save your connection details.

<Tip>
  All database passwords you provide will be encrypted before they are stored to ensure maximum security to your data.
</Tip>

You are now ready to create your first [database connection data source](./managing-database-data-sources).

## Editing a database connection

Database connections can be updated after creation. To edit a database connection, you must be an administrator of your
organisation.

To edit a connection:

* Navigate to the [Database connections page](https://app.dev.wiremock.cloud/data-sources/connections).
* Click on the connection you wish to edit, from the list provided.
* Update your database connection.
* Click on the `save` at the bottom of the page.

<img alt="Edit database connection" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-edit.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=e79a8ea014373be99ba1d34f1d6afcf9" width="744" height="901" data-path="images/screenshots/data-sources/database-connection-edit.png" />

For security, the password is not returned on the edit screen.  You can still update any of the fields and if you
leave the password field blank it will keep the existing password and update all other fields.  To update your
password or re-test the connection you will need to enter your password in the field provided.

## Deleting a database connection

Database connections can be deleted from your organisation. To delete a database connection, you must be an
administrator of your organisation.

To delete a database connection:

* Navigate to the [Database connections page](https://app.dev.wiremock.cloud/data-sources/connections).
* Click on the delete icon for the connection you want to remove.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-delete.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=fda965e9abb88c097cdac3becebb6850" alt="Delete a database connection" title="Delete a database connection" width="861" height="377" data-path="images/screenshots/data-sources/database-connection-delete.png" />
</p>

Clicking on the delete icon will open a confirmation dialog. Click the `Confirm` button to confirm the deletion or
`Cancel` to close the dialog without deleting the connection.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-delete-confirm.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=26b5a848321f5a84862d894f18f4a33c" alt="Delete a database connection confirmation" title="Delete a database connection confirmation" width="663" height="220" data-path="images/screenshots/data-sources/database-connection-delete-confirm.png" />
</p>

Clicking `Confirm` will delete the data source, only if there are no data sources in your organisation that are
currently using it.  If the database connection you are trying to delete is in use an error will be displayed, and you
will not be able to delete the connection.  You will need to update or delete the data sources that are using the
connection and then try to delete again.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/database-connection-delete-confirm-error.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=3eec8fb63db38e57568b79b863995705" alt="Delete a database connection confirmation error" title="Delete a database connection confirmation error" width="667" height="355" data-path="images/screenshots/data-sources/database-connection-delete-confirm-error.png" />
</p>

