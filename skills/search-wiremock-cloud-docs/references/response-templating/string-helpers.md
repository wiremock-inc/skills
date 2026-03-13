> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - String Helpers

> Working with strings

WireMock Cloud provides a set of string manipulation helpers.

## Regular expression extract

The `regexExtract` helper supports extraction of values matching a regular expression from a string.

A single value can be extracted like this:

```handlebars  theme={null}
{{regexExtract request.body '[A-Z]+'}}"
```

Regex groups can be used to extract multiple parts into an object for later use (the last parameter is a variable name to which the object will be assigned):

```handlebars  theme={null}
{{regexExtract request.body '([a-z]+)-([A-Z]+)-([0-9]+)' 'parts'}}
{{parts.0}},{{parts.1}},{{parts.2}}
```

## String transformation helpers

### Trim

Use the `trim` helper to remove whitespace from the start and end of the input:

```handlebars  theme={null}
{{trim request.headers.X-Padded-Header}} // Inline

{{#trim}}                                // Block

    Some stuff with whitespace

{{/trim}}
```

### Abbreviate

`abbreviate` truncates a string if it is longer than the specified number of characters.
Truncated strings will end with a translatable ellipsis sequence ("...").

For instance the following template:

```handlebars  theme={null}
{{abbreviate 'Mocking APIs helps you develop faster' 21 }} // Mocking APIs helps...
```

### Capitalisation

`capitalize` will make the first letter of each word in the passed string a capital e.g.

```handlebars  theme={null}
{{capitalize 'mock my stuff'}} // Mock My Stuff
```

`capitalizeFirst` will capitalise the first character of the value passed e.g.

```handlebars  theme={null}
{{capitalizeFirst 'mock my stuff'}} // Mock my stuff
```

### Center

`center` centers the value in a field of a given width e.g.

```handlebars  theme={null}
{{center 'hello' size=21}}
```

will output:

```
        hello        
```

You can also specify the padding character e.g.

```handlebars  theme={null}
{{center 'hello' size=21 pad='#'}}
```

will output:

```
########hello########
```

### Cut

`cut` removes all instances of the parameter from the given string.

```handlebars  theme={null}
{{cut 'mocking, stubbing, faults' ','}} // mocking stubbing faults
```

### Default if empty

`defaultIfEmpty` outputs the passed value if it is not empty, or the default otherwise e.g.

```handlebars  theme={null}
{{defaultIfEmpty 'my value' 'default'}} // my value

{{defaultIfEmpty '' 'default'}}         // default
```

### Join

`join` takes a set of parameters or a collection and builds a single string, with
each item separated by the specified parameter.

```handlebars  theme={null}
{{join 'Mark' 'Rob' 'Dan' ', '}} // Mark, Rob, Dan
```

You can optionally specify a prefix and suffix:

```handlebars  theme={null}
{{join 'Mark' 'Rob' 'Dan' ', ' prefix='[' suffix=']'}} // [Mark, Rob, Dan]
```

### Justify left and right

`ljust` left-aligns the value in a field of a given width, optionally taking a padding character.

```handlebars  theme={null}
{{ljust 'things' size=20}}         // 'things              '
{{ljust 'things' size=20 pad='#'}} // 'things##############'
```

`rjust` right-aligns the value in the same manner

```handlebars  theme={null}
{{rjust 'things' size=20}}         // '              things'
{{rjust 'things' size=20 pad='#'}} // '##############things'
```

### Lower and upper case

`lower` and `upper` convert the value to all lowercase and all uppercase:

```handlebars  theme={null}
{{lower 'WireMock Cloud'}} // wiremock cloud
{{upper 'WireMock Cloud'}} // WIREMOCK CLOUD
```

### Replace

`replace` replaces all occurrences of the specified substring with the replacement value.

```handlebars  theme={null}
{{replace 'the wrong way' 'wrong' 'right' }} // the right way
```

### Slugify

`slugify` converts to lowercase, removes non-word characters (alphanumerics and
underscores) and converts spaces to hyphens. Also strips leading and trailing whitespace.

```handlebars  theme={null}
{{slugify 'Mock my APIs'}} // mock-my-apis
```

### Strip tags

`stripTags` strips all \[X]HTML tags.

```handlebars  theme={null}
{{stripTags '<greeting>hi</greeting>'}} // hi
```

### Substring

`substring` outputs the portion of a string value between two indices. If only
one index is specified the substring between this point and the end will be returned.

```handlebars  theme={null}
{{substring 'one two' 4}}   // two
{{substring 'one two' 0 3}} // one
```

### Word wrap

`wordWrap` wraps words at specified line length.

```handlebars  theme={null}
{{wordWrap 'one two three' 4}}
```

will output:

```
one
two
three
```

### Yes/no

`yesno` maps values for true, false and optionally null, to the strings "yes",
"no", "maybe".

```handlebars  theme={null}
{{yesno true}}   // yes
{{yesno false}}  // no
{{yesno null}}   // maybe
```

You can also specify different strings to represent each state:

```handlebars  theme={null}
{{yesno true yes='aye'}}    // aye
{{yesno false no='nay'}}    // nay
{{yesno null maybe='meh'}}  // meh
```

