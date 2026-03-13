> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Miscellaneous Helpers

> Other assorted useful helpers

This article describes some useful helpers that don't neatly fit into any of the other categories.

## Assignment

You can create a string variable of own using the `assign` helper, then use it
later in your template e.g.:

```handlebars  theme={null}
{{#assign 'myCapitalisedQuery'}}{{capitalize request.query.search}}{{/assign}}

Capitalised query: {{myCapitalisedQuery}}
```

## Val helper

The `val` helper can be used to access values or provide a default if the value is not present. It can also be used to
assign a value to a variable much like the `assign` helper.  The main difference between `val` and `assign` is that `val`
will maintain the type of the date being assigned whereas `assign` will always assign a string.

```handlebars  theme={null}
{{val request.query.search or='default'}} // the value of request.query.search or 'default' if it's not present
{{val request.query.search default='default'}} // the value of request.query.search or 'default' if it's not present
{{val request.query.search}} // the value of request.query.search or null if it's not present
{{val request.query.search or='default' assign='myVar'}} // assign the value of request.query.search or 'default' to myVar
{{val request.query.search assign='myVar'}} // assign the value of request.query.search to myVar


{{val (array 1 2 3) default='123'}} // [1, 2, 3]
{{val 'value for myVar' assign='myVar'}}{{myVar}} // value for myVar
{{val null or='other value for myVar' assign='myVar'}}{{myVar}} // other value for myVar
{{val 10 assign='myVar'}}{{#lt myVar 20}}Less Than{{else}}More Than{{/lt}} // Less Than
```

## Size

The `size` helper returns the size of a string, list or map:

```handlebars  theme={null}
{{size 'abcde'}}               // Returns 5
{{size request.query.things}}  // Returns number of values in query param 'things'
```

## With

The `with` helper creates a nested scope, allowing you to reference attributes on
an object without fully qualifying it each time.

For instance, given a variable whose value is an object with the properties `id` and `position`,
`with` allows these to be accessed without qualifying each time:

```handlebars  theme={null}
{{#with myObject}}
  ID: {{{id}}}
  Position: {{{position}}}
{{/with}}
```

## Range

The `range` helper emits an array of integers between the bounds specified in the
first and second parameters (both of which are mandatory).

```handlebars  theme={null}
{{range 3 8}}
{{range -2 2}}
```

As mentioned above, you can use this with `randomInt` and `each` to output random length, repeating pieces of content e.g.

```handlebars  theme={null}
{{#each (range 0 (randomInt lower=1 upper=10)) as |index|}}
id: {{index}}
{{/each}}
```

## Array

The `array` helper emits an array containing exactly the values specified as parameters.

```handlebars  theme={null}
{{array 1 'two' true}}
```

Passing no parameters will result in an empty array being returned.

```handlebars  theme={null}
{{array}}
```

## Array add & remove helpers

The `arrayAdd` and `arrayRemove` helpers can be used to add or remove elements from an array based on a position value
or the `start` or `end` keywords. If no position is specified, the element will be added or removed from the end of the
array.

```handlebars  theme={null}
{{arrayAdd (array 1 'three') 2 position=1}} // [1, 2, three]
{{arrayAdd (array 1 'three') 2 position='start'}} // [2, 1, three]
{{arrayAdd (array 1 'three') 2 position='end'}} // [1, three, 2]
{{arrayAdd (array 1 'three') 2}} // [1, three, 2]

{{arrayRemove (array 1 2 'three') position=1}} // [1, three]
{{arrayRemove (array 1 2 'three') position='start'}} // [2, three]
{{arrayRemove (array 1 2 'three') position='end'}} // [1, 2]
{{arrayRemove (array 1 2 'three')}} // [1, 2]
```

## arrayJoin helper

The `arrayJoin` helper will concatenate the values passed to it with the separator specified:

```handlebars  theme={null}
{{arrayJoin ',' (array 'One' 'Two' 'Three')}} // One,Two,Three
{{arrayJoin ' - ' 'a' 'b' 'c'}} // a - b - c
{{arrayJoin ', ' (range 1 5)}} // 1, 2, 3, 4, 5
{{arrayJoin (pickRandom ':') (array 'One' 'Two' 'Three')}} // One:Two:Three
{{arrayJoin '' (array 'W' 'i' 'r' 'e' 'M' 'o' 'c' 'k' ' ' 'R' 'o' 'c' 'k' 's')}} // WireMock Rocks
```

You can also specify a `prefix` and `suffix` to be added to the start and end of the result:

```handlebars  theme={null}
{{arrayJoin ',' (array 'One' 'Two' 'Three') prefix='[' suffix=']'}} // [One,Two,Three]
{{arrayJoin ' * ' (array 1 2 3) prefix='(' suffix=')'}} // (1 * 2 * 3)
```

The `arrayJoin` helper can also be used as a block helper:

```handlebars  theme={null}
{{#parseJson 'myThings'}}
[
  { "id": 1, "name": "One" },
  { "id": 2, "name": "Two" },
  { "id": 3, "name": "Three" }
]
{{/parseJson}}
[{{#arrayJoin ',' myThings as |item|}}
{
"name{{item.id}}": "{{item.name}}"
}
{{/arrayJoin}}] // [{ "name1": "One" }, { "name2": "Two" }, { "name3": "Three" }]


// or the same example with the prefix and suffix parameters
{{#parseJson 'myThings'}}
    [
    { "id": 1, "name": "One" },
    { "id": 2, "name": "Two" },
    { "id": 3, "name": "Three" }
    ]
{{/parseJson}}
{{#arrayJoin ',' myThings prefix='[' suffix=']' as |item|}}
    {
    "name{{item.id}}": "{{item.name}}"
    }
{{/arrayJoin}} // [{ "name1": "One" }, { "name2": "Two" }, { "name3": "Three" }]
```

