> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Creating & Editing Database Data Sources

> Setting up your external test data from a database

<Tip>
  The database data source feature is currently in **private beta**.  If you would like access to this feature contact us
  via the `Get Support` link in the menu bar
</Tip>

## Creating a database data source

Data sources can be created at the organisation level, meaning that the Data sources you create can be shared among the
members of your organisation.

To create a database data source, you first need to create a [database connection](./managing-database-connections)

To create a data source:

* Navigate to the Data Sources page.

  <img alt="Data source menu item" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-navigate.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=1b64f35035513087e69a7daa9820af54" width="616" height="328" data-path="images/screenshots/data-sources/data-source-navigate.png" />

* Click on the button, `+Create new data source`.

  <img alt="Create Data source button" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-create-button.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=ad3a8c540fa41d185dd2b18592889d19" width="557" height="312" data-path="images/screenshots/data-sources/data-source-create-button.png" />

* Choose `Database based` from the dropdown

  <img alt="Create database data source" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-database-create.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=d77979ebb95efd91249ac47b75434501" width="842" height="690" data-path="images/screenshots/data-sources/data-source-database-create.png" />

* Provide a name for your data source.

* Select the database connection you wish to use with this data source

* Enter the name of the table you wish to use with this data source. This can be the name of a table, or a view within
  your database.

* Click `save` at the bottom of the page.

Once the data source has been saved you can view a preview (the first 10 rows) of the data returned from the specified
table by navigating to the data sources page and clicking on the data source you wish to preview.

If the specified table could not be found, an error will be displayed.

<img alt="Edit database data source" src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/data-source-database-preview-error.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=da908ee894f4943e40e84319a058801c" width="705" height="528" data-path="images/screenshots/data-sources/data-source-database-preview-error.png" />

## Editing a database data source

Data sources can be updated after creation.

To edit a data source:

* Navigate to the Data Sources page.
* Click on the data source you wish to edit, from the list provided.
* Update your data source.
* Click on the `save` at the bottom of the page.

Once in the data source page, you will be able to:

* Change the name of the data source
* Change the database connection used by the data source
* Change the table name referenced by the data source

