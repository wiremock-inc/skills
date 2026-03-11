> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Deleting Data Sources

> How to remove data sources from your account

## Deleting a Data Source

Data sources can be deleted from your organisation. To delete a data source:

* Navigate to the [Data sources page](https://app.wiremock.io/data-sources).
* Click on the delete icon for the data source you want to remove.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/delete-data-source.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=2b43075e5e9ee32ce5e41e1b1ee0f542" alt="Delete a data source" title="Delete a data source" width="662" height="464" data-path="images/screenshots/data-sources/delete-data-source.png" />
</p>

Clicking on the delete icon will open a confirmation dialog. Click the `Confirm` button to confirm the deletion or
`Cancel` to close the dialog without deleting the data source.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/delete-data-source-confirmation.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=7f14d6ba4b5328766941a023127c58b8" alt="Delete data source confirmation" title="Delete data source confirmation" width="667" height="252" data-path="images/screenshots/data-sources/delete-data-source-confirmation.png" />
</p>

Clicking `Confirm` will delete the data source, but it will not remove the data source from any stubs that are using it.
These stubs will continue to reference the deleted data source, but will act as if no data was returned when the data
source is queried. See below for more details on stub matching and response templating when a data source is deleted.

When a data source is deleted, any data source limits you may have reached will be re-evaluated. If you have any
disabled data sources, they will be re-enabled if you now have available capacity within your data source limits. You
can read more about [plan limits and disabled data sources here](./plan-limits).

Any stubs that are using the deleted data source will now have a warning message displayed on the stub informing you
that `The data source that this stub was referencing no longer exists.`  You will also see a warning icon next to
the data source summary in the stub form.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/delete-data-source-stub-icon.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=f33f9cc4db8bea01f7a0a3c9661f0ef2" alt="Data source stub warning icon" title="Data source stub warning icon" width="409" height="183" data-path="images/screenshots/data-sources/delete-data-source-stub-icon.png" />
</p>

If you have other data sources within your organisation you can attach one of these to the stub to replace the deleted
data source. If you do not have another data source that you can use, you will need to update the stub to remove the
reference to the deleted data source.

You can do this by clicking on the delete icon next to the data source in the stub form.

<p>
  <img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/data-sources/delete-data-source-stub-notice.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=271956367e5f40a91176e2fb2d402556" alt="Delete data source stub warning" title="Delete data source stub warning" width="1001" height="344" data-path="images/screenshots/data-sources/delete-data-source-stub-notice.png" />
</p>

### Stub Matching

If a stub is using a data source that has been deleted, the stub will no longer match incoming requests if the
`Matches stub only if data is found` tick box is checked on the Stub form. If this tick box is not checked, the stub
will continue to match incoming requests, but the data source will not be queried.

### Data source response templating

If a data source is deleted, any response templates that are using the data source will no longer be able to access the
data source data. The response template will still be rendered, but the data source data will not be available.

