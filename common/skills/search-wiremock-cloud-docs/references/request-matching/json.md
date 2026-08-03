> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Request Matching - Matching JSON requests

> Matching JSON

When stubbing API functions that accept JSON request bodies we may want to
return different responses based on the JSON sent. WireMock Cloud provides two match types
to supports this case - `equalToJson` and `matchesJsonPath`, which are described
in detail in this article.

## Matching via JSON equality

The `equalToJson` match operator performs a semantic comparison of the input JSON
against the expected JSON. This has a number of advantages over a straight string
comparison:

* Ignores differences in whitespace
* Can be configured to ignore differences in array order
* Can be configured to ignore extra object attributes
* Supports placeholders so that specific attributes can be excluded from the comparison

By default `equalToJson` will match only if all of the elements in the input JSON
are the same as the expected JSON, arrays are in the same order and no additional
attributes are present.

For instance, given an expected JSON document like

<img src="https://mintcdn.com/wiremockinc/TMB5bBMjkV05sCok/images/screenshots/default-equal-to-json.png?fit=max&auto=format&n=TMB5bBMjkV05sCok&q=85&s=3a0c7b2f4df3c1bfd863cd6f6a717684" title="Default equal to JSON" width="799" height="365" data-path="images/screenshots/default-equal-to-json.png" />

You would need to send in the request body for the stub to match exactly that JSON
in order for the stub to be matched:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "sizes": ["S", "M", "L"]
}'

{ "result": "OK" }
```

Changing the `sizes` order would cause a non-match:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "sizes": ["L", "M", "S"]
}'

                                               Request was not matched
                                               =======================

-----------------------------------------------------------------------------------------------------------------------
| Closest stub                                             | Request                                                  |
-----------------------------------------------------------------------------------------------------------------------
                                                           |
JSON body matching                                         |
                                                           |
POST                                                       | POST
/json                                                      | /json
                                                           |
{                                                          | {                                                   <<<<< Body does not match
  "itemId" : 102938,                                       |   "itemId" : 102938,
  "sizes" : [ "S", "M", "L" ]                              |   "sizes" : [ "L", "M", "S" ]
}                                                          | }
                                                           |
-----------------------------------------------------------------------------------------------------------------------
```

Adding an extra attribute would also cause a non-match:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "sizes": ["S", "M", "L"],
  "tag": "essentials"
}'

                                               Request was not matched
                                               =======================

-----------------------------------------------------------------------------------------------------------------------
| Closest stub                                             | Request                                                  |
-----------------------------------------------------------------------------------------------------------------------
                                                           |
JSON body matching                                         |
                                                           |
POST                                                       | POST
/json                                                      | /json
                                                           |
{                                                          | {                                                   <<<<< Body does not match
  "itemId" : 102938,                                       |   "itemId" : 102938,
  "sizes" : [ "S", "M", "L" ]                              |   "sizes" : [ "S", "M", "L" ],
}                                                          |   "tag" : "essentials"
                                                           | }
                                                           |
-----------------------------------------------------------------------------------------------------------------------
```

### Ignoring array order

Sometimes the order of elements in an array is unimportant and can change arbitrarily
between multiple requests. In this case it's undesirable for your stub match to fail
due to array order, so to remedy this you can simply tick "Ignore array order".

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/ignore-array-order.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=d5c1e165bfd27813f84545dc25c7822a" title="Equal to JSON ignoring array order" width="812" height="183" data-path="images/screenshots/ignore-array-order.png" />

This will allow requests like the following to succeed:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "sizes": ["S", "L", "M"]
}'                   

{ "result": "OK" }
```

### Ignoring extra elements

If you're only interested in matching a specific set of JSON elements and don't mind
if additional elements are present you can tick "Ignore extra elements".

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/ignore-extra-elements.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=a0a8f2bffc3bd9ca0d7a4d7fa172fc37" title="Equal to JSON ignoring extra elements" width="806" height="184" data-path="images/screenshots/ignore-extra-elements.png" />

This would permit the following to match:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "sizes": ["S", "M", "L"],
  "tag": "essentials"
}'
```

### Using placeholders to ignore specific JSON attributes

If you want to check that an element is present, but don't care what the value is
then you can use JSONUnit placeholder syntax to achieve this.

Note: unlike with XML placeholders this is enabled by default.

For instance, given the following configuration:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/json-placeholders.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=fed4c3a1385939935e36dc6534b7aee1" title="Equal to JSON with placeholder" width="803" height="183" data-path="images/screenshots/json-placeholders.png" />

This would permit the the following to match:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 8888888888,
  "sizes": ["S", "M", "L"],
  "tag": "essentials"
}'
```

When using `${json-unit.ignore}`, the element's type is also ignored (in addition to its value),
so in the above case a string, boolean etc. could have been used in place of the numeric ID.

If you want to constrain an element to a specific type but still ignore the value
you can use one of the following placeholders:

* `${json-unit.regex}[A-Z]+` (any Java-style regular expression can be used)
* `${json-unit.any-string}`
* `${json-unit.any-boolean}`
* `${json-unit.any-number}`

## Matching via JSONPath - `matchesJsonPath`

[JSONPath](https://github.com/json-path/JsonPath) is an expression language,
similar in concept to XPath that permits elements or collections of elements
to be queried from a JSON document.

WireMock Cloud supports stub matching using JSONPath expressions, optionally sub-matching
the result using WireMock Cloud's own operators (`equalTo`, `matches` etc.).

Given the following configration:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/jsonpath-with-submatch.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=b038c116f52301ef8f4f9fed8f6905b5" title="JSONPath with equal to" width="795" height="150" data-path="images/screenshots/jsonpath-with-submatch.png" />

The following JSON will be matched:

```
$ curl https://example.wiremockapi.cloud/json -d '{
  "itemId": 102938,
  "itemName": "Socks"
}'
```

### Expression only vs. expression + sub-match

It is possible to match a JSON document without a sub-match by selecting "is present"
from the drop-down:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/jsonpath-no-submatch.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=762027b220471f579dde96666cfee3de" title="JSONPath with equal to" width="791" height="149" data-path="images/screenshots/jsonpath-no-submatch.png" />

If you do this, the JSON input will be considered a match if the expression returns
1 or more elements.

This feature is primarily present for compatibility with WireMock projects, and
generally it is better to use sub-matches as this results in simpler JSONPath
expressions and more useful debug output when there is a non-match.

### Common JSONPath examples

Matching on a specific array element by position.

`$.sizes[1]` `equal to` `M`

would match:

```json  theme={null}
{
  "sizes": ["S", "M", "L"]
}
```

Matching on an element of an object found via another element.

`$.addresses[?(@.type == 'business')].postcode` `contains` `N11NN`

would match:

```json  theme={null}
{
  "addresses": [
    {
      "type": "home",
      "postcode": "Z55ZZ"
    },
    {
      "type": "business",
      "postcode": "N11NN"
    }
  ]
}
```

It is necessary to use `contains` in this instance as a JSONPath expression containing
a query part (between the `[?` and `]`) will always return a collection
of results.

Matching an element found recursively.

`$..postcode` `contains` `N11NN`

would match:

```json  theme={null}
{
  "addresses": [
    {
      "type": "home",
      "postcode": "Z55ZZ"
    },
    {
      "type": "business",
      "postcode": "N11NN"
    }
  ]
}
```

and would also match:

```json  theme={null}
{
  "address": {
    "type": "business",
    "postcode": "N11NN"
  }
}
```

