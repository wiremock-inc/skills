> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Stateful Mocking and Scenarios

> Return different responses based on a state machine

Some testing activities require that different responses be served for a sequence of identical requests. For instance if you are testing a to-do list application [such as this one](../samples/exploratory-testing-tutorial/) you may wish to start with no to-do list items, post a new item, then see the item appear in the list.

Assuming there is a "list to-do items" API call used to fetch the list, this must be called twice during the above test, returning no items on the first invocation, and the newly added item on the second. Since both of these requests will be identical (same URL, method, request headers), something additional is required for WireMock Cloud to differentiate the first and
second cases.

WireMock Cloud's Scenarios solve this problem by providing finite state machines that can be used as additional stub matching conditions.

They allow more than one definition of an otherwise identical stub with different responses based on the current state of the machine.

## Stateful mocking vs. Scenarios

WireMock Cloud provides scenarios as a way to create advanced, pre-defined testing conditions. Alternatively, you can use our [dynamic states feature](../dynamic-state/overview) for truly stateful mocking that allows you to define operations and context to use in dynamic test sessions concurrently.

## Example

To implement the above case, you would declare that the stub returning the empty list is only matched when the scenario state is "Started",
while the stub returning the list with one item is only matched when the scenario state is "First item added".

Start by creating the empty list stub, which is matched only when the scenario named "To do list" is in the "Started" state:

<img title="Empty to-do list stub" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/scenarios-empty-list-stub.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=1f57f39fbd52d23553fe4ef5fb1f4559" width="836" height="1001" data-path="images/screenshots/scenarios-empty-list-stub.png" />

Then create a stub to handle posting of the first list item. When triggered this stub will move the scenario state to "First item added":

<img title="To-do list POST stub" src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/scenarios-post-item-stub.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=113248b5685262b82a49873ff6927ace" width="822" height="969" data-path="images/screenshots/scenarios-post-item-stub.png" />

Finally, create a stub to return the list containing one item, which is matched only when the scenario is in the "First item added" state:

<img title="Single item to-do list stub" src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/scenario-single-item-stub.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=b05b34b71cee681da4bc0602d7b3c6df" width="833" height="957" data-path="images/screenshots/scenario-single-item-stub.png" />

## Testing

First, make a `GET` request to fetch the list, which should be empty. You should be able to do this any number of times
without the result changing:

```
$ curl http://example.wiremockapi.cloud/todo-items
{
  "items": []
}
```

Now `POST` a new item (it actually doesn't matter what the request body contains, since we didn't specify a body matcher in the stub):

```
$ curl http://example.wiremockapi.cloud/todo-items -X POST
```

This should now have moved the scenario state to "First item added". Getting the list of items again should now return one item:

```
$ curl http://example.wiremockapi.cloud/todo-items
{
  "items": [
    {
      "id": "1",
      "description": "Read all about Scenarios"
    }
  ]
}
```

## Scenario reset

All scenarios can be reset to their "Started" state by clicking Reset.

