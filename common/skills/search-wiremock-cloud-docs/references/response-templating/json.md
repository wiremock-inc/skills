> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Working with JSON

> Working with JSON and JSONPath

## Extracting data with JSONPath

WireMock Cloud provides the `jsonPath` helper which will extract values from a JSON document
using the [JSONPath](https://github.com/json-path/JsonPath) expression language.

Similar in concept to XPath, JSONPath permits selection of individual values or sub-documents
via a query expression.

For example, given the JSON

```json  theme={null}
{
  "outer": {
    "inner": "Stuff"
  }
}
```

The following will render "Stuff" into the output:

```handlebars  theme={null}
{{jsonPath request.body '$.outer.inner'}}
```

And for the same JSON the following will render `{ "inner": "Stuff" }`:

```handlebars  theme={null}
{{jsonPath request.body '$.outer'}}
```

## Iterating over JSON elements

The `jsonPath` helper outputs a "one or many" collection, which can either
be printed directly, or passed to further helpers such as [`each`](./conditional-logic-and-iteration/#iteration) or [`join`](./string-helpers/#join).

For instance, given a request body of the form:

```json  theme={null}
{
  "things": [
    {
      "id": 1
    },
    {
      "id": 2
    },
    {
      "id": 3
    }
  ]
}
```

And the following response body template:

```handlebars  theme={null}
{{#each (jsonPath request.body '$.things') as |thing|}}
thing: {{{thing.id}}}{{/each}}
```

The response body will contain:

```
thing: 1
thing: 2
thing: 3
```

The above will only work if the JSONPath expression selects an array from the
request JSON. However, `each` can also be used to iterate over maps/objects, so given
the request JSON:

```json  theme={null}
{
  "things": {
    "one": 1,
    "two": 2,
    "three": 3
  }
}
```

And the template:

```handlebars  theme={null}
{{#each (jsonPath request.body '$.things') as |value key|}}
{{{key}}}={{{value}}}{{/each}}
```

The output would contain:

```
one=1
two=2
three=3
```

## Adding to a JSON Array

The `jsonArrayAdd` helper allows you to append an element to an existing json array.

Its simplest form just takes two parameters, the array to append to and the item to be added:

```handlebars  theme={null}
{{jsonArrayAdd existingArray newItem}}
```

The above template will produce the following JSON:

```json  theme={null}
[
    {
        "id": 123,
        "name": "alice"
    },
    {
        "id": 321,
        "name": "sam"
    }
]
```

You can also use it in block form to parse the contents of the block as the new item to add:

```handlebars  theme={null}
{{#jsonArrayAdd existingArray}}
{
  "id": 321,
  "name": "sam"
}
{{/jsonArrayAdd}}
```

It may be convenient to default the array to an empty array if it does not exist:

```handlebars  theme={null}
{{#jsonArrayAdd (val existingArray or='[]')}}
{
  "id": 321,
  "name": "sam"
}
{{/jsonArrayAdd}}
```

The number of items in the array can be limited by using the `maxItems` parameter:

```handlebars  theme={null}
{{#assign 'existingArray'}}
[
    {
        "id": 123,
        "name": "alice"
    },
    {
        "id": 321,
        "name": "sam"
    }
]
{{/assign}}

{{#jsonArrayAdd existingArray maxItems=2}}
{
    "id": 456,
    "name": "bob"
}
{{/jsonArrayAdd}}
```

The above template will produce the following JSON.  The first item in the array has been removed to maintain the
number of items in the array as specified by the `maxItems` parameter:

```json  theme={null}
[
  {
    "id": 321,
    "name": "sam"
  },
  {
    "id": 456,
    "name": "bob"
  }
]
```

You can add arrays to the existing json array using this helper:

```handlebars  theme={null}
{{#assign 'existingArray'}}
[
    {
        "id": 123,
        "name": "alice"
    },
    {
        "id": 321,
        "name": "sam"
    }
]
{{/assign}}

{{#jsonArrayAdd existingArray}}
[
    {
        "id": 456,
        "name": "bob"
    }
]
{{/jsonArrayAdd}}
```

The above template will produce the following JSON:

```json  theme={null}
[
  {
    "id": 123,
    "name": "alice"
  },
  {
    "id": 321,
    "name": "sam"
  },
  [
    {
      "id": 456,
      "name": "bob"
    }
  ]
]
```

If you want the end result to be a single json array, you can use the `flatten` attribute:

```handlebars  theme={null}
{{#assign 'existingArray'}}
[
    {
        "id": 123,
        "name": "alice"
    },
    {
        "id": 321,
        "name": "sam"
    }
]
{{/assign}}

{{#jsonArrayAdd existingArray flatten=true}}
[
    {
        "id": 456,
        "name": "bob"
    }
]
{{/jsonArrayAdd}}
```

The above template will produce the following JSON:

```json  theme={null}
[
  {
    "id": 123,
    "name": "alice"
  },
  {
    "id": 321,
    "name": "sam"
  },
  {
    "id": 456,
    "name": "bob"
  }
]
```

You can use the `jsonArrayAdd` helper to add items to a nested array.  This is achieved using the `jsonPath` property
and referencing the array you want to add an item to:

```handlebars  theme={null}
{{#assign 'existingArray'}}
[
    {
        "id": 123,
        "names":["alice", "sam"]
    },
    {
        "id": 321,
        "names":["fred", "neil"]
    }
]
{{/assign}}

{{#assign 'itemToAdd'}}"bob"{{/assign}}

{{jsonArrayAdd existingArray itemToAdd jsonPath='$[0].names'}}
```

The above template will produce the following JSON:

```json  theme={null}
[
  {
    "id": 123,
    "names": [ "alice", "sam", "bob" ]
  },
  {
    "id": 321,
    "names": [ "fred", "neil" ]
  }
]
```

## Removing from a JSON Array or Object

The `jsonRemove` helper allows you to remove an element from an existing json array, or remove a key from an existing
json object, by identifying it using a [json path](https://datatracker.ietf.org/doc/rfc9535/) expression.

For instance, given an existing array like this:

```handlebars  theme={null}
{{#assign 'existingArray'}}
[
  { "id": 456, "name": "bob"},
  { "id": 123, "name": "alice"},
  { "id": 321, "name": "sam"}
]
{{/assign}}
```

application of this helper, which selects the object with id `123`:

```handlebars  theme={null}
{{jsonRemove existingArray '$.[?(@.id == 123)]'}}
```

will return this array:

```json  theme={null}
[
  { "id": 456, "name": "bob"},
  { "id": 321, "name": "sam"}
]
```

Given an object like this:

```handlebars  theme={null}
{{#assign 'existingObject'}}
{ "id": 456, "name": "bob"}
{{/assign}}
```

application of this helper, which selects the key `name`:

```handlebars  theme={null}
{{jsonRemove existingObject '$.name'}}
```

will return this object:

```json  theme={null}
{ "id": 456 }
```

## Merging JSON objects

The `jsonMerge` helper allows you to merge two json objects. Merging will recurse into any common keys where the values
are both objects, but not into any array values, where the value in the second object will overwrite that in the first.

Given these two objects:

```handlebars  theme={null}
{{#assign 'object1'}}
{
  "id": 456, 
  "forename": "Robert",
  "surname": "Smith",
  "address": {
    "number": "12"
  },
  "hobbies": [ "chess", "football" ]
}
{{/assign}}
{{#assign 'object2'}}
{
  "name": "Robert",
  "nickname": "Bob",
  "address": {
    "street": "High Street"
  },
  "hobbies": [ "rugby" ]
}
{{/assign}}
```

```handlebars  theme={null}
{{jsonMerge object1 object2}}
```

will return this object:

```json  theme={null}
{
  "id": 456,
  "forename": "Robert",
  "surname": "Smith",
  "nickname": "Bob",
  "address": {
    "number": "12",
    "street": "High Street"
  },
  "hobbies": [ "rugby" ]
}
```

Like the `jsonArrayAdd` helper, the second object can be provided as a block:

```handlebars  theme={null}
{{#jsonMerge object1}}
{
  "name": "Robert",
  "nickname": "Bob",
  "address": {
    "street": "High Street"
  },
  "hobbies": [ "rugby" ]
}
{{/jsonMerge}}
```

### Removing attributes

The `jsonMerge` helper has an optional `removeNulls` parameter which, when set to true will remove any attributes from the resulting JSON that
have null values in the second JSON document.

So for instance, given the following template:

```handlebars  theme={null}
{{#assign 'object1'}}
{
    "keepMe": 1,
    "removeMe": 2
}
{{/assign}}

{{#jsonMerge object1 removeNulls=true}}
{
    "removeMe": null
}
{{/jsonMerge}}
```

The resulting JSON would be:

```json  theme={null}
{
    "keepMe": 1
}
```

## Formatting JSON

The `formatJson` helper allows you to output JSON in either a pretty or a compact format. The default is pretty:

```handlebars  theme={null}
{{#assign 'object1'}}
{"id": 456,
     "forename": "Robert", "surname": "Smith",
  "address": {
    "number": "12"
},
"hobbies": [ "chess", 
"football" ]
}
{{/assign}}
{{formatJson object1}}
```

emits:

```json  theme={null}
{
  "id" : 456,
  "forename" : "Robert",
  "surname" : "Smith",
  "address" : {
    "number" : "12"
  },
  "hobbies" : [ "chess", "football" ]
}
```

Whereas

```handlebars  theme={null}
{{formatJson object1 format='compact'}}
```

emits

```json  theme={null}
{"id":456,"forename":"Robert","surname":"Smith","address":{"number":"12"},"hobbies":["chess","football"]}
```

The json to format can also be supplied as a block body:

```handlebars  theme={null}
{{#formatJson}}
{"id": 456,
     "forename": "Robert", "surname": "Smith",
  "address": {
    "number": "12"
},
"hobbies": [ "chess", 
"football" ]
}
{{/formatJson}}
```

## Sorting JSON Arrays

The `jsonSort` helper allows you to specify a field within a JSON array to sort by.
The field is referenced using a JSON path expression, and all sort field values must be
of the same comparable type (Number, String, or Boolean).  For example:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[
    {
        "id": 123,
        "name": "sam"
    },
    {
        "id": 321,
        "name": "alice"
    }
]
{{/assign}}

{{jsonSort jsonArray '$[*].name'}}
```

The above template will produce the following JSON:

```json  theme={null}
[
  {
    "id": 321,
    "name": "alice"
  },
  {
    "id": 123,
    "name": "sam"
  }
]
```

The order of the sorting is `ascending (asc)` by default.  This can be changed by supplying `desc` for the `order` parameter.
For example:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[
    {
        "id": 123,
        "name": "sam"
    },
    {
        "id": 321,
        "name": "alice"
    }
]
{{/assign}}

{{jsonSort jsonArray '$[*].id' order='desc'}}
```

The above template will produce the following JSON:

```json  theme={null}
[
  {
    "id": 321,
    "name": "alice"
  },
  {
    "id": 123,
    "name": "sam"
  }
]
```

The array being referenced in the JSON path expression must be an array, but it doesn't have to be a top-level array.
For example:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
{"users":[{"name":"fred"},{"name":"bob"}]}
{{/assign}}

{{jsonSort jsonArray '$.users[*].name'}}
```

The above template will produce the following JSON:

```json  theme={null}
{"users":[{"name":"bob"},{"name":"fred"}]}
```

Even though all sort field values must be of the same comparable type (Number, String, or Boolean), this equally works for
dates where they can be compared as strings. For example:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[{"id":1,"created":"2025-03-15T14:30:00Z"},{"id":2,"created":"2025-01-10T09:15:00Z"},{"id":3,"created":"2025-12-01T18:45:00Z"}]
{{/assign}}

{{jsonSort jsonArray '$[*].created'}}
```

The above template will produce the following JSON:

```json  theme={null}
 [{"id":2,"created":"2025-01-10T09:15:00Z"},{"id":1,"created":"2025-03-15T14:30:00Z"},{"id":3,"created":"2025-12-01T18:45:00Z"}]
```

Simple arrays can also be sorted using the `jsonSort` helper:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
["charlie","alice","bob"]
{{/assign}}

{{jsonSort jsonArray '$[*]'}}
```

The above template will produce the following JSON:

```json  theme={null}
["alice","bob","charlie"]
```

You can also reference arrays in a specific index position using the `jsonPath` parameter:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[{"items":[{"price":30},{"price":10},{"price":20}]},{"items":[{"price":100},{"price":50}]}]
{{/assign}}

{{jsonSort jsonArray '$[0].items[*].price'}}
```

The above template will produce the following JSON:

```json  theme={null}
[{"items":[{"price":10},{"price":20},{"price":30}]},{"items":[{"price":100},{"price":50}]}]
```

### Handling null when sorting

The `jsonSort` helper allows you to sort on a field that can be missing or null. When
sorting, missing fields are treated as null.  By default, nulls are added to the
beginning of the sorted array:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[{"id":1,"name":"alice"},{"id":2},{"id":3,"name":"bob"}]
{{/assign}}

{{jsonSort jsonArray '$[*].name'}}
```

The above template will produce the following JSON:

```json  theme={null}
[{"id":2},{"id":1,"name":"alice"},{"id":3,"name":"bob"}]
```

This can be changed by supplying a `nulls` parameter and setting the value to `last` - `nulls='last'`.  This will
move nulls to the end of the sorted array:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[{"id":1,"name":"alice"},{"id":2},{"id":3,"name":"bob"}]
{{/assign}}

{{jsonSort jsonArray '$[*].name' nulls='last'}}
```

The above template will produce the following JSON:

```json  theme={null}
[{"id":1,"name":"alice"},{"id":3,"name":"bob"},{"id":2}]
```

The `nulls` parameter can also be set to `first` or `last`.

### Stable Sorting

The `jsonSort` helper provides a 'stable' sort where the order of equal values are preserved. For example, sorting on
a field that contains duplicate values will maintain the order within the array.  This is demonstrated in the following
example:

```handlebars  theme={null}
{{#assign 'jsonArray'}}
[{"id":"a","score":100},{"id":"b","score":50},{"id":"c","score":50},{"id":"d","score":25},{"id":"e","score":50}]""";
{{/assign}}

{{jsonSort jsonArray '$[*].score'}}
```

The above template will produce the following JSON where the order of the duplicate items is preserved:

```json  theme={null}
[{"id":"d","score":25},{"id":"b","score":50},{"id":"c","score":50},{"id":"e","score":50},{"id":"a","score":100}]
```

## Reading object as JSON

The `parseJson` helper will take the string value of the provided variable (or the contents of the block) and parse it
into an object or array, and assign it to the given variable.

e.g.

```handlebars  theme={null}
{{#parseJson 'newVariableName'}}
    [ "shoes", "socks" ]
{{/parseJson}}
```

will add an array called `newVariableName` that can be used in subsequent helpers.

The contents to parse can also be supplied inline:

```handlebars  theme={null}
{{#assign 'inputString'}}
    [ "shoes", "socks" ]
{{/assign}}
{{parseJson inputString 'newVariableName'}}
```

If no variable name is supplied the result of the parsing is output.

## Writing data as a JSON string

The `toJson` helper will convert any object into a JSON string.

```handlebars  theme={null}
{{toJson (array 1 2 3)}}
```

emits

```json  theme={null}
[ 1, 2, 3 ]
```

