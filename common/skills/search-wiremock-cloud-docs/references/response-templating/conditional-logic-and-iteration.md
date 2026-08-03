> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Conditional Logic and Iteration

> Working with if statements, loops and collections.

Taking actions conditionally and looping over collections of data are very common
requirements from a templating system. This article explains how these are achieved
in WireMock Cloud.

## Conditional logic with if / else and unless

Handlebars provides a set of core helpers that implement if / else if / else logic
of the kind found in many programming languages.

As with most implementations of if, the simples form is to take an action only if
the condition is true:

```handlebars  theme={null}
{{#if showDetails}}
  <div id="details">...</div>
{{/if}}
```

An else clause can be used:

```handlebars  theme={null}
{{#if showDetails}}
  <div id="details">...</div>
{{else}}
  <div id="details" class="hidden">...</div>
{{/if}}
```

And any number of else if clauses can also be added:

```handlebars  theme={null}
{{#if showVariantA}}
  <div id="var-a">...</div>
{{else if showVariantB}}
  <div id="var-b">...</div>
{{else if showVariantC}}
  <div id="var-c">...</div>
{{else}}
  <div id="default-var">...</div>
{{/if}}
```

Finally, you can take an action if a condition is false using `unless`:

```handlebars  theme={null}
{{#unless hideDetails}}
  <div id="details">...</div>
{{/unless}}
```

## Comparison helpers

The `if`, `else if` and `unless` helpers all take a single boolean value
as their parameter. In practice you often need to derive that value by comparing
other values, and for this we have a set of helpers implementing common comparison operations.

For instance if you needed to check that a variable equalled a particular string
you would use the `eq` helper:

```handlebars  theme={null}
{{#eq name 'Dan'}}
  <div id="dan">...</div>
{{/eq}}
```

You can nest comparison helpers inside the `if` helper:

```handlebars  theme={null}
{{#if (eq name 'Dan')}}
  <div id="dan">...</div>
{{/if}}
```

You can also use comparison helpers with `else`:

```handlebars  theme={null}
{{#eq name 'Dan'}}
  <div id="dan">...</div>
{{else eq name 'Mark'}}
  <div id="mark">...</div>
{{else}}
  <div id="anon">...</div>
{{/eq}}
```

The following comparison helpers are available:

`eq` - equal

```handlebars  theme={null}
{{#eq name 'Jeff'}}...{{/eq}}
```

`neq` - not equal

```handlebars  theme={null}
{{#neq name 'Jeff'}}...{{/neq}}
```

`gt` - greater than

```handlebars  theme={null}
{{#gt itemCount 3}}...{{/gt}}
```

`gte` - greater than or equal to

```handlebars  theme={null}
{{#gte itemCount 3}}...{{/gte}}
```

`lt` - less than

```handlebars  theme={null}
{{#lt itemCount 3}}...{{/lt}}
```

`lte` - less than or equal

```handlebars  theme={null}
{{#lte itemCount 3}}...{{/lte}}
```

`and` - logical AND

```handlebars  theme={null}
{{#and (lt itemCount 10) (gt itemCount 5)}}...{{/and}}
```

`or` - logical OR

```handlebars  theme={null}
{{#or (eq itemCount 1) (eq itemCount 2)}}...{{/or}}
```

`not` - logical NOT

```handlebars  theme={null}
{{#not (eq itemCount 1)}}...{{/not}}
```

## Iteration

You can loop over collections of data using the `each` helper.

```handlebars  theme={null}
{{#each request.query.things as |thing|}}
  thing: {{{thing}}}
{{/each}}
```

### Iterating over JSON and XML elements

The `jsonPath` and `xPath` helpers both output collections so these can be used
in an `each` loop. See [Working with JSON](./json/#iterating-over-json-elements) and
[Working with XML](./xml/#iterating-over-xml-elements) for details.

### Detecting the first and last element while looping

Often it can be useful to know when you're processing the first or last element
in a collection e.g. so that you can decide whether to output a separate character.

You can do this using the `@first` and `@last` variables that are automatically
provided to the scope inside the `each` block.

For instance, if you wanted to output a list of JSON objects, separated with
commas and avoiding an extraneous comma at the end:

```handlebars  theme={null}
{{#each (jsonPath request.body '$.things') as |thing|}}
  {{#if @last}}
    { "thing": {{{thing}}} }
  {{else}}
    { "thing": {{{thing}}} },
  {{/if}}
{{/each}}
```

### Getting the loop index

The `each` helper also creates an `@index` variable in its scope which you can use
to get at the (zero-indexed) element counter:

```handlebars  theme={null}
{{#each (jsonPath request.body '$.things') as |thing|}}
  {{@index}}: {{thing}}
{{/each}}
```

## String and collection conditionals

### Contains helper

The `contains` helper returns a boolean value indicating whether the string or array passed as the first parameter
contains the string passed in the second.

It can be used as parameter to the `if` helper:

```handlebars  theme={null}
{{#if (contains 'abcde' 'abc')}}YES{{/if}}
{{#if (contains (array 'a' 'b' 'c') 'a')}}YES{{/if}}
```

Or as a block element on its own:

```handlebars  theme={null}
{{#contains 'abcde' 'abc'}}YES{{/contains}}
{{#contains (array 'a' 'b' 'c') 'a'}}YES{{/contains}}
```

### Matches helper

The `matches` helper returns a boolean value indicating whether the string passed as the first parameter matches the
regular expression passed in the second:

Like the `contains` helper it can be used as parameter to the `if` helper:

```handlebars  theme={null}
{{#if (matches '123' '[0-9]+')}}YES{{/if}}
```

Or as a block element on its own:

```handlebars  theme={null}
{{#matches '123' '[0-9]+'}}YES{{/matches}}
```

