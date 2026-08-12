> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Import & Export - Via the API

> Automating import and export of mock API stubs via WireMock Cloud's API.

A mock API's stubs can be exported in bulk via the admin API. This can be useful for backing
up your API to source control, or cloning the contents of one API into another.

## Importing

To import any of the supported formats (Swagger, OpenAPI, WireMock Cloud WireMock JSON),
execute a `POST` request to the stub import URL e.g.:

<CodeGroup dropdown>
  ```bash theme={null}
  curl -v \
    --data-binary @my-swagger-spec.yaml \
    -H 'Authorization:Token my-api-token' \
    https://my-api.wiremockapi.cloud/__admin/ext/imports
  ```

  ```java theme={null}
  HttpResponse<String> response =
    Unirest.post("https://my-api.wiremockapi.cloud/__admin/ext/imports")
      .header("Authorization", "Token my-api-token")
      .body(Files.readAllBytes(Paths.get("my-swagger-spec.yaml")))
      .asString();
  ```

  ```javascript theme={null}
  const fs = require('fs');

  const options = {
    method: 'POST',
    headers: { 'Authorization': 'Token my-api-token' },
    body: fs.readFileSync('my-swagger-spec.yaml', 'utf8')
  };

  fetch('https://my-api.wiremockapi.cloud/__admin/ext/imports', options)
    .then(res => ...);
  ```

  ```python theme={null}
  import requests

  with open('my-swagger-spec.yaml', 'rb') as spec:
      response = requests.post(
          'https://my-api.wiremockapi.cloud/__admin/ext/imports',
          headers={'Authorization': 'Token my-api-token'},
          data=spec
      )
  ```

  ```ruby theme={null}
  require 'uri'
  require 'net/http'

  uri = URI('https://my-api.wiremockapi.cloud/__admin/ext/imports')

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = 'Token my-api-token'
  request.body = File.read('my-swagger-spec.yaml')

  response = http.request(request)
  ```

  ```php theme={null}
  <?php
  $curl = curl_init('https://my-api.wiremockapi.cloud/__admin/ext/imports');

  curl_setopt_array($curl, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => file_get_contents('my-swagger-spec.yaml'),
      CURLOPT_HTTPHEADER => [
          'Authorization: Token my-api-token',
      ],
  ]);

  $response = curl_exec($curl);
  ```

  ```go theme={null}
  import (
      "net/http"
      "os"
  )

  file, _ := os.Open("my-swagger-spec.yaml")
  defer file.Close()

  req, _ := http.NewRequest(
      "POST",
      "https://my-api.wiremockapi.cloud/__admin/ext/imports",
      file,
  )
  req.Header.Set("Authorization", "Token my-api-token")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()
  ```
</CodeGroup>

More detail can be found in our [API reference](../api-reference/imports/import-into-a-mock-api).

## Exporting in WireMock Cloud/WireMock JSON format

To export an API's stubs, execute a `GET` request to the stub mappings admin URL e.g.:

<CodeGroup dropdown>
  ```bash theme={null}
  curl --output my-stubs.json \
    -H 'Authorization:Token my-api-token' \
    https://my-api.wiremockapi.cloud/__admin/mappings
  ```

  ```java theme={null}
  HttpResponse<String> response =
    Unirest.get("https://my-api.wiremockapi.cloud/__admin/mappings")
      .header("Authorization", "Token my-api-token")
      .asString();

  Files.writeString(Paths.get("my-stubs.json"), response.getBody());
  ```

  ```javascript theme={null}
  const fs = require('fs');

  const options = {
    headers: { 'Authorization': 'Token my-api-token' }
  };

  fetch('https://my-api.wiremockapi.cloud/__admin/mappings', options)
    .then(res => res.json())
    .then(json => fs.writeFileSync('my-stubs.json', JSON.stringify(json)));
  ```

  ```python theme={null}
  import requests

  response = requests.get(
      'https://my-api.wiremockapi.cloud/__admin/mappings',
      headers={'Authorization': 'Token my-api-token'}
  )

  with open('my-stubs.json', 'w') as stubs:
      stubs.write(response.text)
  ```

  ```ruby theme={null}
  require 'uri'
  require 'net/http'

  uri = URI('https://my-api.wiremockapi.cloud/__admin/mappings')

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = 'Token my-api-token'

  response = http.request(request)

  File.write('my-stubs.json', response.body)
  ```

  ```php theme={null}
  <?php
  $curl = curl_init('https://my-api.wiremockapi.cloud/__admin/mappings');

  curl_setopt_array($curl, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Token my-api-token',
      ],
  ]);

  $response = curl_exec($curl);

  file_put_contents('my-stubs.json', $response);
  ```

  ```go theme={null}
  import (
      "io"
      "net/http"
      "os"
  )

  req, _ := http.NewRequest(
      "GET",
      "https://my-api.wiremockapi.cloud/__admin/mappings",
      nil,
  )
  req.Header.Set("Authorization", "Token my-api-token")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  file, _ := os.Create("my-stubs.json")
  defer file.Close()
  io.Copy(file, resp.Body)
  ```
</CodeGroup>

You can find your API token at [https://app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security).
