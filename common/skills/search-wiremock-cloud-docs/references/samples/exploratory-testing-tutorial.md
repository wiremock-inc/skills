> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Exploratory Testing With Spring Boot

> Exploratory testing a Spring Boot app with WireMock Cloud

This tutorial demonstrates how WireMock Cloud can be used to perform a manual exploratory test of an application with an API back-end.

The app is a simple to-do list based on Java and Spring Boot, supporting listing of to-do items and posting new ones. Any version off Spring Boot, such as spring boot 3, will suffice for this tutorial.

## Mock API setup

If you haven't yet created a mock API in WireMock Cloud, start by doing this. See [Getting Started](/overview#getting-started) for how to do this.
Make a note of the base URL from the Settings page (any of them will do).

## App setup

Ensure that you have Java 8+ installed and the `java` executable on your shell's `PATH`.

Clone the WireMock Cloud demo project and change the working directory to the newly checked out project:

```bash  theme={null}
git clone git@github.com:wiremock/wiremock-cloud-demo-app.git
cd wiremock-cloud-demo-app
```

Edit `src/main/resources/application.properties` changing the `todo-api.baseurl` value to your mock API's base URL noted earlier.

Run the app:

```bash  theme={null}
./gradlew bootRun
```

This should start the app locally on port `9000`.

## Step 1 - show a list of to do items

Navigate to the Stubs page and create a new stub with method `GET`, URL `/todo-items`, response `Content-Type` header `application/json` and the following JSON in the response body:

```json  theme={null}
{
  "items": [
    {
      "id": "1",
      "description": "First item"
    },
    {
      "id": "2",
      "description": "Item number two"
    },
    {
      "id": "3",
      "description": "Do that number three thing"
    },
    {
      "id": "4",
      "description": "Don't forget the fourth thing on the list"
    }
  ]
}
```

Your stub should look something like this:

<img title="To do list stub" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-stub.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=4e4abc5d583227a08a39bb8c25fc3e4c" width="1950" height="1750" data-path="images/screenshots/to-do-stub.png" />

Once you've saved the stub, point your browser to [http://localhost:9000](http://localhost:9000).
You should see the to-do items in your response body listed in the page:

<img title="To do list" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-list-app.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=db85e74dbe5bd421dc6e26f0a8fa710d" width="1358" height="702" data-path="images/screenshots/to-do-list-app.png" />

What has happened here is that the Spring Boot app has made a REST request to WireMock Cloud, which was matched by the stub you just created.
The stub returned a JSON response which the app parsed and rendered into an HTML page.

Now try modifying one or more of the item descriptions in the stub response and saving it, then refreshing the page. You should
immediately see your new items in the to-to list.

## Step 2 - simulating the posting of a new item

Next we're going to simulate a new item being added to the list via a POST request.

For this you'll need another new stub, this time for `POST` to `/todo-items` , response `Content-Type` header `application/json` and the following JSON in the response body:

```json  theme={null}
{ "message": "Successfully sent new item." }
```

Your stub should look like this:

<img title="To do list POST stub" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-post-stub.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=290724753b5fda33e9c210e7f0d77307" width="1958" height="1752" data-path="images/screenshots/to-do-post-stub.png" />

Once that's saved, go to the to-do list page and add a new item by typing a description in the field and clicking the button:

<img title="New to-do item" src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/new-to-do-item-field.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=f84f0c0a864aa52191883c495f9b77af" width="1226" height="168" data-path="images/screenshots/new-to-do-item-field.png" />

You should now see the success message you put in the stub response:

<img title="Success message" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-list-success-message.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=6b18f47f5977f80cd2633b1998b15907" width="1312" height="850" data-path="images/screenshots/to-do-list-success-message.png" />

You'll notice that the contents of the list hasn't changed. This is because WireMock Cloud stubs aren't stateful - the app will load whatever is in the `GET /todo-items` stub you created at the start until you change it. However, if you visit the request log in the WireMock Cloud UI you can confirm that the request you expected actually arrived:

<img title="To do post request log" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-request-log.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=3ccf811dba3d889a45629f2e06d8213e" width="2464" height="1692" data-path="images/screenshots/to-do-request-log.png" />

## Step 3 - posting a new item fails

In this step we're going to deliberately return an error from the API in order to test that the app behaves appropriately.

Navigate to the `POST /todo-items` stub you created in the previous step and clone it (using the Clone button at the end of the form).

In the newly cloned stub, expand the Advanced section and give the stub a higher priority - 4 or less will work as the default is 5.
The reason we need to do this is to ensure that this and not the OK posting stub we cloned from is guaranteed to match an incoming `POST /todo-items`.

In the response section change the response code to 502 and the message in the JSON body to something suitable:

<img title="To do list stub" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-bad-post-stub.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=057de9c083864b43b3b19aad106bfe60" width="1918" height="1914" data-path="images/screenshots/to-do-bad-post-stub.png" />

Now try adding a new to-do item as you did in Step 2. When after submitting it, you should see an error page like this:

<img title="To do error" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/to-do-error-page.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=e65c44e69f6dbdd6a027bce79ad336c5" width="694" height="358" data-path="images/screenshots/to-do-error-page.png" />

