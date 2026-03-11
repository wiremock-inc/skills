> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Dynamic State Shopping Basket Example

> A workable example of using dynamic state to mock CRUD operations on a shopping basket

To learn how to use WireMock Cloud's Dynamic State capabilities, let's look at a working example of using dynamic state
to mock CRUD operations on a shopping basket.

## Getting started

You can start your own copy of this example Mock API from a template just by clicking on this link:
[Launch Shopping Basket Mock](https://app.wiremock.cloud/new-mock/stateful-shopping)

## Exploring the behaviour

### Get an empty basket

Let's start by seeing what is in a shopping basket. Make a request to any basket:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
```

You should see a response that looks like this:

```json  theme={null}
{
  "items" : [ ],
  "total" : 0
}
```

You'll get the same thing if you request this:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/2/items'
```

### Add some items to some baskets & retrieve those baskets

Let's add some items to some baskets. First let's add a couple of items to the basket with id `1`:

```bash  theme={null}
curl -v -X POST \
  -d '{ "id": "1", "item": "Socks", "quantity": 5 }' \
  'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
  
curl -v -X POST \
  -d '{ "id": "2", "item": "Shoes", "quantity": 3 }' \
  'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
```

Now when we get the items in the basket with id `1` we should see the items we just added:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
```

returns

```json  theme={null}
{
  "items" : [ {
    "id" : "1",
    "item" : "Socks",
    "quantity" : 5
  }, {
    "id" : "2",
    "item" : "Shoes",
    "quantity" : 3
  } ],
  "total" : 2
}
```

However, when we retrieve a *different* basket it will still be empty:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/2/items'
```

returns

```json  theme={null}
{
  "items" : [ ],
  "total" : 0
}
```

Have a play with adding items to different baskets and retrieving those baskets; you can use just about anything as the
`basketId` in the path template `/baskets/{basketId}/items`.

### Retrieve specific items from a basket

We can also retrieve a specific item from a basket by id. Try this:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items/2'
```

It should return

```json  theme={null}
{
  "id" : "2",
  "item" : "Shoes",
  "quantity" : 3
}
```

However, if you try and get an item you never added, you should get a 404:

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items/56'
```

returns

```json  theme={null}
{
  "error": "Cannot find item id 56 in basket 1"
}
```

### Remove an item from a basket

You can also remove a single item from a basket. Try this:

```bash  theme={null}
curl -v -X DELETE \
  'https://my-basket-demo.wiremockapi.cloud/baskets/1/items/2'  
```

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
```

should now return

```json  theme={null}
{
  "items" : [ {
    "id" : "1",
    "item" : "Socks",
    "quantity" : 5
  } ],
  "total" : 1
}
```

and

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items/2'
```

should now return

```json  theme={null}
{
  "error": "Cannot find item id 2 in basket 1"
}
```

### Entirely empty the basket

You can remove all items from a basket. Try this:

```bash  theme={null}
curl -v -X DELETE \
  'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'  
```

```bash  theme={null}
curl -v 'https://my-basket-demo.wiremockapi.cloud/baskets/1/items'
```

should now return

```json  theme={null}
{
  "items" : [ ],
  "total" : 0
}
```

### Conclusion

You should now be pretty happy that your Mock API that you have spun up from the template is behaving like a fairly
orthodox JSON over HTTP API, and crucially that it is both stateful, and that the state is localized to a specific
basket id.

So let's start to understand how it works.

## How it Works

We'll take it stub by stub, examining how the stub delivers the functionality we need.

### The "Get basket contents" Stub

This stub uses the "Path template" match type for a method `GET` and a path of `/baskets/{basketId}/items`. That means
it will accept any valid URI path segment as a `basketId`. It will be available to Handlebars templates as
`request.path.basketId`.

You will note that the "State" section is still folded up. That's because this is a read only stub; it doesn't alter
state at all. Any stub can render state variables in its response, you don't need to toggle Dynamic State on to do that.

The stateful configuration comes in the Response definition. Unsurprisingly "Enable dynamic response templating" is
checked. The body contains the following Handlebars template:

```handlebars  theme={null}
{{val (state 'basketItems' context=request.path.basketId) or='[]' assign='basketItems'}}
{
    "items": {{basketItems}},
    "total": {{size (parseJson basketItems)}}
}
```

Let's break it down.

In the first line, the [`state` helper](./overview/#setting-and-rendering-simple-state) reads the value of the key
`'basketItems'` in the context `request.path.basketId`. You'll notice the key there is a string, but the context
parameter is not - it looks up the `basketId` path parameter from the request. Those two values are combined to look up
the items.

At first the lookup will return `null`, because we have never initialised the `'basketItems'` key in any context,
including the current value of `request.path.basketId`. To handle that case we use the [`val` helper](/response-templating/misc-helpers/#val-helper),
which takes a value as its context, but can use an `or` option to default to a different value should that value be
`null`. In this case we default it to `'[]'`; state values are all stored as strings, and we interpret them as JSON when
we retrieve them.

Finally, we use the `assign` option on the `val` helper to put the result of the `val` helper into the Handlebars model
with the key `basketItems`. From now on we can just use `basketItems` in Handlebars helpers, or
`{{ basketItems }}` to render them.

Now let's look at what we actually output:

```handlebars  theme={null}
{
    "items": {{basketItems}},
    "total": {{size (parseJson basketItems)}}
}
```

This is just JSON with some Handlebars interpolations. `"items": {{basketItems}}` renders the
`basketItems` key we defined in the `val` helper above - either the value of the `basketItems` state key or `[]` if it
was `null`.

`"total": {{size (parseJson basketItems)}}` uses a combination of the `parseJson` helper to turn
`basketItems` into JSON in memory (remember state is just stored as a string) and the
[`size` helper](/response-templating/misc-helpers/#size) to work out how big the resulting array is.

Let's move on to adding items.

### The "Add item" Stub

Like the "Get basket contents" stub, this stub uses the "Path template" match type for a path of
`/baskets/{basketId}/items`, but this time it matches if the method is `POST`.

It also has a [Body matcher](/request-matching/json/), which uses
[JsonUnit expressions](/request-matching/json/#using-placeholders-to-ignore-specific-json-attributes)
to only match the format of JSON we expect in a new item.

This time the "State" panel is opened, and "Dynamic state" is toggled on. This is because we now have a single "State
operation" defined.

It has its "Context" set to `{{request.path.basketId}}`. "Context" identifiers are just strings,
but they can be built using Handlebars templates. In this case the context is derived from the `basketId` path parameter
on the request. It has its "Key" set to `'basketItems'`, its "Operation" to `SET` and its "Value" to

```handlebars  theme={null}
{{jsonArrayAdd (val previousValue or='[]') request.body}}
```

Just like context identifiers, state values are just strings emitted by Handlebars templates. They have a special key
provided to them, `previousValue`; it is set to the value of the key in the context when the operation runs. It will be
`null` if the key has no value in this context. In this case we use the `val` helper described above to default it to an
empty JSON array string. We then use the [`jsonArrayAdd` helper](/response-templating/json/#adding-to-a-json-array) to
append the entire request body as a new item in the array. We know the request body will be a valid JSON object because
of the Body matcher defined above.

### The "Get item by ID (success)" Stub

This stub uses the "Path template" match type for a method `GET` and a path of `/baskets/{basketId}/items/{itemId}`.
That means it will accept any valid URI path segment as a `basketId` or an `itemId` and expose them to Handlebars
templates as `request.path.basketId` and `request.path.itemId` respectively.

Like the "Add item" stub, the "State" panel is opened, and "Dynamic state" is toggled on. However, instead of a state
operation, this stub defines a request matcher. The matcher has its "Context" set to
`{{request.path.basketId}}` and its "Key" set to `'basketItems'`, just like the "Add item" state
operation. However, it then has the standard matching form. In this case we use the ["matches JSONPath" matcher](/request-matching/matcher-types/#matchesjsonpath)
to say that this stub only matches if the [JSONPath](https://www.ietf.org/archive/id/draft-goessner-dispatch-jsonpath-00.html)
expression `$.[?(@.id == '{{request.path.itemId}}')]` finds an object. This expression assumes the
top level JSON is an array, and looks for an item inside that array with a key `id` and a value
`'{{request.path.itemId}}'`. You'll note that the expression here is actually a Handlebars
template, so it is able to match against parts of the request model.

This means that this entire stub will only match if the `itemId` is in the `basketItems` for the current `basketId`
context.

The request body ("Enable dynamic response templating" checked) then looks like this:

```handlebars  theme={null}
{{#assign 'findExpression'}}$.[?(@.id == '{{request.path.itemId}}')]{{/assign}}
{{jsonPath (jsonPath (state 'basketItems' context=request.path.basketId) findExpression) '$[0]'}}
```

We've built up exactly the same JSONPath expression as in the matcher, and assigned it to the key
`findExpression`. We have inlined retrieving the `basketItems` key from the state with the correct context using `(state
'basketItems' context=request.path.basketId)`. We can then use the
[`jsonPath` helper](/response-templating/json/#extracting-data-with-jsonPath)
to extract that item from the `basketItems` as so: `jsonPath (state 'basketItems' context=request.path.basketId)
findExpression`. We know it will be there because otherwise the stub would not have matched. Unfortunately [JSONPath
provides no way to debrief a result array as part of the expression](https://github.com/json-path/JsonPath/issues/272),
so we have to wrap it in a further `jsonPath` helper call to retrieve the single element of the resulting array.

### The "Get item by ID (not found)" Stub

The "Get item by ID (not found)" stub uses exactly the same `GET` and path template `/baskets/{basketId}/items/{itemId}`
matchers as the "Get item by ID (success)" stub. However, it is set to a lower Priority (7) than the success stub (5),
and consequently it only matches if the success stub does *not* match. This means we do not need to do any cleverness
with dynamic state; we can simply make it return a 404 with a useful error message derived dynamically from the path.

### The "Delete item by ID" Stub

The "Delete item by ID" stub uses the same path template `/baskets/{basketId}/items/{itemId}` matcher as the "Get item
by ID (success)" stub, but with the `DELETE` method.

The "State" panel is opened, and "Dynamic state" is toggled on, with a single state operation very similar to the "Add
item" stub. As we are used to it has its "Context" set to `{{request.path.basketId}}`, its
"Key" set to `'basketItems'` and its "Operation" to `SET`. However, its "Value" is

```handlebars  theme={null}
{{#assign 'removalExpression'}}$.[?(@.id == '{{request.path.itemId}}')]{{/assign}}
{{jsonRemove previousValue removalExpression}}
```

The `removalExpression` should be familiar - it's the same JSONPath expression as we used in the "Get item by ID
(success)" stub, both to match and to render the item in the `basketItems` array. This time however we pass it to the
[`jsonRemove` helper](/response-templating/json/#removing-from-a-json-array-or-object) which will render an array
without any of the elements from the `previousValue` that match the expression.

### The "Empty Basket" Stub

The "Empty Basket" stub uses the same path template `/baskets/{basketId}/items` matcher as the "Get basket contents"
stub, but with the `DELETE` method.

The "State" panel is opened, and "Dynamic state" is toggled on, with a single state operation very similar to the "Add
item" stub. As we are used to it has its "Context" set to `{{request.path.basketId}}` and its
"Key" set to `'basketItems'`. However, its "Operation" is set to `DELETE`. This means that when this stub matches the
`basketItems` key will be entirely removed in the `{{request.path.basketId}}` context.

(We could instead have used a `SET` operation with a "Value" of `[]`.)

