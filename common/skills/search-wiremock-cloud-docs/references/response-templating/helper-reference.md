> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Helper Reference

> Complete reference of all available Handlebars helpers

This article provides a comprehensive reference for all Handlebars helpers available in WireMock Cloud's response templating system.

## Date and Time Helpers

### now

Renders the current date/time with optional formatting and offset.

**Parameters:**

* `format`: Date format string (optional, defaults to ISO8601)
* `offset`: Time offset (e.g., '3 days', '-24 seconds')
* `timezone`: Timezone (optional, defaults to UTC)

**Usage:**

```handlebars  theme={null}
{{now}}
{{now offset='3 days'}}
{{now offset='-24 seconds'}}
{{now offset='10 years' format='yyyy-MM-dd'}}
{{now timezone='Australia/Sydney' format='yyyy-MM-dd HH:mm:ssZ'}}
{{now format='epoch'}}
{{now format='unix'}}
```

See [Dates and Times](./dates-and-times#current-datetime) for more details.

***

### date

Manipulates existing date values with offset, timezone, and format changes.

**Parameters:**

* First parameter: Date value
* `format`: Date format string (optional)
* `offset`: Time offset (optional)
* `timezone`: Timezone (optional)

**Usage:**

```handlebars  theme={null}
{{date myDate offset='-1 days' timezone='America/New_York' format='yyyy-MM-dd'}}
```

See [Dates and Times](./dates-and-times#existing-date-values) for more details.

***

### parseDate

Parses date strings into date objects.

**Parameters:**

* First parameter: Date string
* `format`: Parser format string (optional)

**Usage:**

```handlebars  theme={null}
{{parseDate request.headers.MyDate}}
{{parseDate '10/11/2021' format="dd/MM/yyyy"}}
{{parseDate '1577964091000' format="epoch"}}
{{parseDate '1577964091' format="unix"}}
```

See [Dates and Times](./dates-and-times#parsing-dates-from-strings) for more details.

***

### dateFormat

Formats date values to strings using predefined or custom formats.

**Parameters:**

* First parameter: Date value
* Second parameter: Format name (`full`, `long`, `medium`, `short`) or custom format string
* `format`: Alternative way to specify format string

**Usage:**

```handlebars  theme={null}
{{dateFormat (parseDate '2020-01-01T11:11:11Z') 'full'}}
{{dateFormat (parseDate '2020-01-01T11:11:11Z') format='yyyy-MM-dd'}}
```

See [Dates and Times](./dates-and-times#formatting-dates) for more details.

***

### truncateDate

Truncates date/times to specific points.

**Parameters:**

* First parameter: Date value
* Second parameter: Truncation point

**Truncation points:**

* `first minute of hour`
* `first hour of day`
* `first day of month`
* `first day of next month`
* `last day of month`
* `first day of year`
* `first day of next year`
* `last day of year`

**Usage:**

```handlebars  theme={null}
{{truncateDate (parseDate '2021-06-14T00:00:00Z') 'last day of month'}}
```

See [Dates and Times](./dates-and-times#truncating-dates) for more details.

***

## String Helpers

### regexExtract

Extracts values from strings using regular expressions.

**Parameters:**

* First parameter: Input string
* Second parameter: Regular expression pattern
* Third parameter (optional): Variable name to assign captured groups

**Usage:**

```handlebars  theme={null}
{{regexExtract request.body '[A-Z]+'}}
{{regexExtract request.body '([a-z]+)-([A-Z]+)-([0-9]+)' 'parts'}}
{{parts.0}},{{parts.1}},{{parts.2}}
```

See [String Helpers](./string-helpers#regular-expression-extract) for more details.

***

### trim

Removes whitespace from the start and end of strings.

**Usage:**

```handlebars  theme={null}
{{trim request.headers.X-Padded-Header}}

{{#trim}}
    Some stuff with whitespace
{{/trim}}
```

See [String Helpers](./string-helpers#trim) for more details.

***

### abbreviate

Truncates strings that exceed a specified length, adding ellipsis.

**Parameters:**

* First parameter: Input string
* Second parameter: Maximum length

**Usage:**

```handlebars  theme={null}
{{abbreviate 'Mocking APIs helps you develop faster' 21}}
```

Output: `Mocking APIs helps...`

See [String Helpers](./string-helpers#abbreviate) for more details.

***

### capitalize

Capitalizes the first letter of each word.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{capitalize 'mock my stuff'}}
```

Output: `Mock My Stuff`

See [String Helpers](./string-helpers#capitalisation) for more details.

***

### capitalizeFirst

Capitalizes only the first character of the string.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{capitalizeFirst 'mock my stuff'}}
```

Output: `Mock my stuff`

See [String Helpers](./string-helpers#capitalisation) for more details.

***

### center

Centers text in a field of given width.

**Parameters:**

* First parameter: Input string
* `size`: Field width (required)
* `pad`: Padding character (optional, defaults to space)

**Usage:**

```handlebars  theme={null}
{{center 'hello' size=21}}
{{center 'hello' size=21 pad='#'}}
```

See [String Helpers](./string-helpers#center) for more details.

***

### cut

Removes all instances of a specified substring.

**Parameters:**

* First parameter: Input string
* Second parameter: Substring to remove

**Usage:**

```handlebars  theme={null}
{{cut 'mocking, stubbing, faults' ','}}
```

Output: `mocking stubbing faults`

See [String Helpers](./string-helpers#cut) for more details.

***

### defaultIfEmpty

Returns the input value if not empty, otherwise returns a default.

**Parameters:**

* First parameter: Input value
* Second parameter: Default value

**Usage:**

```handlebars  theme={null}
{{defaultIfEmpty 'my value' 'default'}}
{{defaultIfEmpty '' 'default'}}
```

See [String Helpers](./string-helpers#default-if-empty) for more details.

***

### join

Joins multiple values or collections into a single string.

**Parameters:**

* Multiple values to join
* Last parameter: Separator string
* `prefix`: Optional prefix
* `suffix`: Optional suffix

**Usage:**

```handlebars  theme={null}
{{join 'Mark' 'Rob' 'Dan' ', '}}
{{join 'Mark' 'Rob' 'Dan' ', ' prefix='[' suffix=']'}}
```

See [String Helpers](./string-helpers#join) for more details.

***

### ljust

Left-aligns text in a field of given width.

**Parameters:**

* First parameter: Input string
* `size`: Field width (required)
* `pad`: Padding character (optional)

**Usage:**

```handlebars  theme={null}
{{ljust 'things' size=20}}
{{ljust 'things' size=20 pad='#'}}
```

See [String Helpers](./string-helpers#justify-left-and-right) for more details.

***

### rjust

Right-aligns text in a field of given width.

**Parameters:**

* First parameter: Input string
* `size`: Field width (required)
* `pad`: Padding character (optional)

**Usage:**

```handlebars  theme={null}
{{rjust 'things' size=20}}
{{rjust 'things' size=20 pad='#'}}
```

See [String Helpers](./string-helpers#justify-left-and-right) for more details.

***

### lower

Converts string to lowercase.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{lower 'WireMock Cloud'}}
```

Output: `wiremock cloud`

See [String Helpers](./string-helpers#lower-and-upper-case) for more details.

***

### upper

Converts string to uppercase.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{upper 'WireMock Cloud'}}
```

Output: `WIREMOCK CLOUD`

See [String Helpers](./string-helpers#lower-and-upper-case) for more details.

***

### replace

Replaces all occurrences of a substring with another.

**Parameters:**

* First parameter: Input string
* Second parameter: Substring to find
* Third parameter: Replacement string

**Usage:**

```handlebars  theme={null}
{{replace 'the wrong way' 'wrong' 'right'}}
```

Output: `the right way`

See [String Helpers](./string-helpers#replace) for more details.

***

### slugify

Converts text to URL-friendly slug format.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{slugify 'Mock my APIs'}}
```

Output: `mock-my-apis`

See [String Helpers](./string-helpers#slugify) for more details.

***

### stripTags

Removes all HTML/XML tags from string.

**Parameters:**

* First parameter: Input string

**Usage:**

```handlebars  theme={null}
{{stripTags '<greeting>hi</greeting>'}}
```

Output: `hi`

See [String Helpers](./string-helpers#strip-tags) for more details.

***

### substring

Extracts a portion of a string between indices.

**Parameters:**

* First parameter: Input string
* Second parameter: Start index
* Third parameter (optional): End index

**Usage:**

```handlebars  theme={null}
{{substring 'one two' 4}}
{{substring 'one two' 0 3}}
```

See [String Helpers](./string-helpers#substring) for more details.

***

### wordWrap

Wraps text at specified line length.

**Parameters:**

* First parameter: Input string
* Second parameter: Line length

**Usage:**

```handlebars  theme={null}
{{wordWrap 'one two three' 4}}
```

See [String Helpers](./string-helpers#word-wrap) for more details.

***

### yesno

Maps boolean/null values to customizable yes/no/maybe strings.

**Parameters:**

* First parameter: Boolean or null value
* `yes`: Custom yes string (optional)
* `no`: Custom no string (optional)
* `maybe`: Custom maybe/null string (optional)

**Usage:**

```handlebars  theme={null}
{{yesno true}}
{{yesno false}}
{{yesno null}}
{{yesno true yes='aye'}}
{{yesno false no='nay'}}
{{yesno null maybe='meh'}}
```

See [String Helpers](./string-helpers#yesno) for more details.

***

## Encoding Helpers

### base64

Encodes or decodes Base64 strings.

**Parameters:**

* First parameter: Input string
* `decode`: Set to `true` for decoding (optional)
* `padding`: Set to `false` to disable padding (optional)

**Usage:**

```handlebars  theme={null}
{{{base64 request.headers.X-Plain-Header}}}
{{{base64 request.headers.X-Plain-Header padding=false}}}
{{{base64 request.headers.X-Encoded-Header decode=true}}}

{{#base64}}Content to encode{{/base64}}

{{#base64 decode=true}}Q29udGVudCB0byBkZWNvZGUK{{/base64}}
```

See [String Encodings](./string-encodings#base64) for more details.

***

### urlEncode

Encodes or decodes URL strings according to HTTP URL encoding standard.

**Parameters:**

* First parameter: Input string
* `decode`: Set to `true` for decoding (optional)

**Usage:**

```handlebars  theme={null}
{{{urlEncode request.headers.X-Plain-Header}}}
{{{urlEncode request.headers.X-Encoded-Header decode=true}}}

{{#urlEncode}}Content to encode{{/urlEncode}}

{{#urlEncode decode=true}}Content%20to%20decode{{/urlEncode}}
```

See [String Encodings](./string-encodings#urls) for more details.

***

### formData

Parses HTTP form data into an object.

**Parameters:**

* First parameter: Form data string
* Second parameter: Variable name to assign
* `urlDecode`: Set to `true` to URL decode values (optional)

**Usage:**

```handlebars  theme={null}
{{formData request.body 'form' urlDecode=true}}{{{form.formField3}}}
{{formData request.body 'form' urlDecode=true}}{{{form.multiValueField.1}}}
{{formData request.body 'form' urlDecode=true}}{{{form.multiValueField.first}}}
```

See [String Encodings](./string-encodings#forms) for more details.

***

## Number Helpers

### math

Performs arithmetic operations.

**Parameters:**

* First parameter: Left operand
* Second parameter: Operator (`+`, `-`, `*`, `/`, `%`)
* Third parameter: Right operand

**Operators:**

* `+`: Addition
* `-`: Subtraction
* `*`: Multiplication
* `/`: Division
* `%`: Modulo (remainder)

**Usage:**

```handlebars  theme={null}
{{math 1 '+' 2}}
{{math 4 '-' 2}}
{{math 2 '*' 3}}
{{math 8 '/' 2}}
{{math 10 '%' 3}}
```

See [Number Helpers](./number-helpers#math-helper) for more details.

***

### numberFormat

Formats numbers with control over style, decimal places, and locale.

**Parameters:**

* First parameter: Number to format
* Second parameter (optional): Format type (`integer`, `currency`, `percent`) or format string
* Third parameter (optional): Locale string
* `maximumFractionDigits`: Maximum decimal places
* `minimumFractionDigits`: Minimum decimal places
* `maximumIntegerDigits`: Maximum integer digits
* `minimumIntegerDigits`: Minimum integer digits
* `groupingUsed`: Enable/disable digit grouping (default true)
* `roundingMode`: Rounding mode (`up`, `down`, `half_up`, `half_down`, `half_even`, `ceiling`, `floor`)

**Usage:**

```handlebars  theme={null}
{{{numberFormat 123.4567 'currency' 'en_GB'}}}
{{{numberFormat 123.4567 'percent' 'en_GB'}}}
{{{numberFormat 123.4567 '###.000000' 'en_GB'}}}
{{{numberFormat 1234.567 maximumIntegerDigits=3 minimumFractionDigits=6}}}
{{{numberFormat 12345.678 groupingUsed=false}}}
{{{numberFormat 1.239 roundingMode='down' maximumFractionDigits=2}}}
```

See [Number Helpers](./number-helpers#formatting-numbers) for more details.

***

## Random Value Helpers

### randomValue

Generates random strings of specified type and length.

**Parameters:**

* `length`: Length of string (required for most types)
* `type`: Type of random string (required)
* `uppercase`: Convert to uppercase (optional)

**Types:**

* `ALPHANUMERIC`: Letters and numbers
* `ALPHABETIC`: Letters only
* `NUMERIC`: Numbers only
* `ALPHANUMERIC_AND_SYMBOLS`: Letters, numbers, and symbols
* `HEXADECIMAL`: Hex characters (0-9, A-F)
* `UUID`: UUID format (length not needed)

**Usage:**

```handlebars  theme={null}
{{randomValue length=33 type='ALPHANUMERIC'}}
{{randomValue length=12 type='ALPHANUMERIC' uppercase=true}}
{{randomValue length=55 type='ALPHABETIC'}}
{{randomValue length=27 type='ALPHABETIC' uppercase=true}}
{{randomValue length=10 type='NUMERIC'}}
{{randomValue length=5 type='ALPHANUMERIC_AND_SYMBOLS'}}
{{randomValue length=5 type='HEXADECIMAL' uppercase=true}}
{{randomValue type='UUID'}}
```

See [Random Values](./random-values#random-strings) for more details.

***

### randomInt

Generates random integers with optional bounds.

**Parameters:**

* `lower`: Lower bound (optional)
* `upper`: Upper bound (optional)

**Usage:**

```handlebars  theme={null}
{{randomInt}}
{{randomInt lower=5 upper=9}}
{{randomInt upper=54323}}
{{randomInt lower=-24}}
```

See [Random Values](./random-values#random-numbers) for more details.

***

### randomDecimal

Generates random decimal numbers with optional bounds.

**Parameters:**

* `lower`: Lower bound (optional)
* `upper`: Upper bound (optional)

**Usage:**

```handlebars  theme={null}
{{randomDecimal}}
{{randomDecimal lower=-10.1 upper=-0.9}}
{{randomDecimal upper=12.5}}
{{randomDecimal lower=-24.01}}
```

See [Random Values](./random-values#random-numbers) for more details.

***

### pickRandom

Randomly selects a value from parameters or collection.

**Parameters:**

* First parameter: Collection (optional) or first value
* Additional parameters: More values to choose from
* `count`: Number of unique items to select (optional)

**Usage:**

```handlebars  theme={null}
{{pickRandom '1' '2' '3'}}
{{pickRandom numberList}}
{{pickRandom 1 2 3 4 5 count=3}}
```

See [Random Values](./random-values#pick-random) for more details.

***

### random

Generates random test data using Faker library.

**Parameters:**

* First parameter: Faker key (e.g., 'Name.firstName', 'Address.city')

**Usage:**

```handlebars  theme={null}
{{random 'Name.firstName'}}
{{random 'Name.lastName'}}
{{random 'Internet.emailAddress'}}
{{random 'Address.city'}}
{{random 'PhoneNumber.phoneNumber'}}
```

See [Generate Test Data](./random-faker) for the complete list of available keys.

***

## JSON Helpers

### jsonPath

Extracts values from JSON documents using JSONPath expressions.

**Parameters:**

* First parameter: JSON string or object
* Second parameter: JSONPath expression

**Usage:**

```handlebars  theme={null}
{{jsonPath request.body '$.outer.inner'}}
{{jsonPath request.body '$.things[0].id'}}
```

See [Working with JSON](./json) for more details.

***

### jsonArrayAdd

Appends elements to a JSON array.

**Parameters:**

* First parameter: Existing array
* Second parameter (optional): Item to add
* `maxItems`: Maximum array size (optional)
* `flatten`: Flatten nested arrays (optional)
* `jsonPath`: Path to nested array (optional)

**Usage:**

```handlebars  theme={null}
{{jsonArrayAdd existingArray newItem}}

{{#jsonArrayAdd existingArray}}
{
  "id": 321,
  "name": "sam"
}
{{/jsonArrayAdd}}

{{#jsonArrayAdd existingArray maxItems=2}}
{
  "id": 456,
  "name": "bob"
}
{{/jsonArrayAdd}}

{{#jsonArrayAdd existingArray flatten=true}}
[
  {
    "id": 456,
    "name": "bob"
  }
]
{{/jsonArrayAdd}}

{{jsonArrayAdd existingArray itemToAdd jsonPath='$[0].names'}}
```

See [Working with JSON](./json#adding-to-a-json-array) for more details.

***

### jsonRemove

Removes elements from JSON arrays or keys from objects using JSONPath.

**Parameters:**

* First parameter: JSON object or array
* Second parameter: JSONPath expression

**Usage:**

```handlebars  theme={null}
{{jsonRemove existingArray '$.[?(@.id == 123)]'}}
{{jsonRemove existingObject '$.name'}}
```

See [Working with JSON](./json#removing-from-a-json-array-or-object) for more details.

***

### jsonMerge

Merges two JSON objects recursively.

**Parameters:**

* First parameter: Base object
* Second parameter (optional): Object to merge
* `removeNulls`: Remove null-valued attributes (optional)

**Usage:**

```handlebars  theme={null}
{{jsonMerge object1 object2}}

{{#jsonMerge object1}}
{
  "name": "Robert",
  "nickname": "Bob"
}
{{/jsonMerge}}

{{#jsonMerge object1 removeNulls=true}}
{
  "removeMe": null
}
{{/jsonMerge}}
```

See [Working with JSON](./json#merging-json-objects) for more details.

***

### formatJson

Formats JSON in pretty or compact style.

**Parameters:**

* First parameter (optional): JSON to format
* `format`: Style (`pretty` or `compact`, defaults to `pretty`)

**Usage:**

```handlebars  theme={null}
{{formatJson object1}}
{{formatJson object1 format='compact'}}

{{#formatJson}}
{"id": 456, "name": "Robert"}
{{/formatJson}}
```

See [Working with JSON](./json#formatting-json) for more details.

***

### parseJson

Parses JSON string into object and assigns to variable.

**Parameters:**

* First parameter: JSON string or variable name
* Second parameter (optional): Variable name to assign

**Usage:**

```handlebars  theme={null}
{{#parseJson 'newVariableName'}}
    [ "shoes", "socks" ]
{{/parseJson}}

{{parseJson inputString 'newVariableName'}}
```

See [Working with JSON](./json#reading-object-as-json) for more details.

***

### toJson

Converts any object to JSON string.

**Parameters:**

* First parameter: Object to convert

**Usage:**

```handlebars  theme={null}
{{toJson (array 1 2 3)}}
```

See [Working with JSON](./json#writing-data-as-a-json-string) for more details.

***

## XML Helpers

### xPath

Extracts values or sub-documents from XML using XPath 1.0 expressions.

**Parameters:**

* First parameter: XML string
* Second parameter: XPath expression

**Usage:**

```handlebars  theme={null}
{{{xPath request.body '/outer/inner/text()'}}}
{{{xPath request.body '/outer/inner/@id'}}}
```

See [Working with XML](./xml) for more details.

***

### soapXPath

Convenience helper for extracting values from SOAP body elements.

**Parameters:**

* First parameter: SOAP XML string
* Second parameter: XPath expression (relative to SOAP body)

**Usage:**

```handlebars  theme={null}
{{{soapXPath request.body '/a/test/text()'}}}
```

See [Working with XML](./xml#soap-xpath) for more details.

***

### formatXml

Formats XML in pretty or compact style.

**Parameters:**

* First parameter (optional): XML to format
* `format`: Style (`pretty` or `compact`, defaults to `pretty`)

**Usage:**

```handlebars  theme={null}
{{formatXml object1}}
{{formatXml object1 format='compact'}}

{{#formatXml}}
<foo><bar>wh</bar></foo>
{{/formatXml}}
```

See [Working with XML](./xml#formatting-xml) for more details.

***

## Cryptographic Helpers

### hash

Creates cryptographic hashes of text.

**Parameters:**

* `algorithm`: Hashing algorithm (required)
* `encoding`: Output encoding (`hex` or `base64`, required)

**Algorithms:**

* `sha-1`, `sha-224`, `sha-256`, `sha-384`, `sha-512`
* `sha3-224`, `sha3-256`, `sha3-384`, `sha3-512`
* `md2`, `md5`

**Usage:**

```handlebars  theme={null}
{{#hash algorithm='sha-256' encoding='hex'}}text to hash{{/hash}}
{{#hash algorithm='md5' encoding='base64'}}text to hash{{/hash}}
```

See [Cryptographic Helpers](./cryptographic-helpers) for more details.

***

## JWT Helpers

### jwt

Generates signed JSON Web Tokens.

**Parameters:**

* `alg`: Signing algorithm (`HS256` or `RS256`, defaults to `HS256`)
* `maxAge`: Expiry duration (e.g., '12 days')
* `exp`: Expiry date (alternative to maxAge)
* `nbf`: Not before date (optional)
* `iss`: Issuer claim (optional)
* `aud`: Audience claim (optional)
* `sub`: Subject claim (optional)
* Any additional parameters become custom claims

**Usage:**

```handlebars  theme={null}
{{{jwt maxAge='12 days'}}}
{{{jwt exp=(parseDate '2040-02-23T21:22:23Z')}}}
{{{jwt nbf=(parseDate '2018-02-23T21:22:23Z')}}}
{{{jwt iss='https://jwt-example.wiremockapi.cloud/'}}}
{{{jwt aud='https://jwt-target.wiremockapi.cloud/'}}}
{{{jwt sub='jonsmith'}}}
{{{jwt
    isAdmin=true
    quota=23
    score=0.96
    email='jonsmith@example.com'
}}}
{{{jwt alg='RS256'}}}
```

See [JWT Web Tokens](./jwt#generating-a-token) for more details.

***

### jwks

Generates JSON Web Key Set for RS256 public keys.

**Usage:**

```handlebars  theme={null}
{{{jwks}}}
```

See [JWT Web Tokens](./jwt#the-json-web-key-set-jwks) for more details.

***

## Dynamic State Helpers

### state

Retrieves a state value stored in a context by its key.

**Parameters:**

* First parameter: Key name (required)
* `context`: Context name (optional, uses default context if not specified)

**Usage:**

```handlebars  theme={null}
{{state 'itemName'}}
{{state 'userId' context='v1_users'}}
{{state 'id' context=collectionContext}}
```

See [Dynamic State Basics](../dynamic-state/overview#setting--rendering-simple-state) for more details.

***

### stateContext

Sets the default context for all `state` helpers within its block, avoiding repetition.

**Parameters:**

* First parameter: Context name or expression (required)

**Usage:**

```handlebars  theme={null}
{{#stateContext request.headers.x-test-id}}
  The current itemName is {{state 'itemName'}}
  The current userId is {{state 'userId'}}
{{/stateContext}}

{{#stateContext collectionContext}}
  {{#formatJson}}
    {{state id}}
  {{/formatJson}}
{{/stateContext}}
```

See [Dynamic State Basics](../dynamic-state/overview#rendering-a-state-value-from-an-explicit-context) for more details.

***

### listState

Returns all state values within a given context as a collection.

**Parameters:**

* First parameter: Context name or expression (required)

**Usage:**

```handlebars  theme={null}
{{listState request.headers.x-test-id}}
{{listState collectionContext}}

{{#formatJson}}
{
  "users" : [{{#arrayJoin ',' (listState collectionContext) as |item|}}
    {{jsonPath item '$.user'}}
  {{/arrayJoin}}]
}
{{/formatJson}}

{{#formatJson}}
  [{{arrayJoin ',' (listState collectionContext)}}]
{{/formatJson}}
```

See [Dynamic State Basics](../dynamic-state/overview#rendering-all-state-values-within-a-context) for more details.

***

## Collection and Utility Helpers

### assign

Creates a string variable for later use.

**Parameters:**

* First parameter: Variable name

**Usage:**

```handlebars  theme={null}
{{#assign 'myCapitalisedQuery'}}{{capitalize request.query.search}}{{/assign}}

Capitalised query: {{myCapitalisedQuery}}
```

See [Miscellaneous Helpers](./misc-helpers#assignment) for more details.

***

### val

Accesses values with default fallback, maintains type (unlike assign).

**Parameters:**

* First parameter: Value or expression
* `or`/`default`: Default value if first parameter is absent
* `assign`: Variable name to assign result

**Usage:**

```handlebars  theme={null}
{{val request.query.search or='default'}}
{{val request.query.search default='default'}}
{{val request.query.search}}
{{val request.query.search or='default' assign='myVar'}}
{{val request.query.search assign='myVar'}}
{{val (array 1 2 3) default='123'}}
{{val 'value for myVar' assign='myVar'}}{{myVar}}
{{val 10 assign='myVar'}}{{#lt myVar 20}}Less Than{{else}}More Than{{/lt}}
```

See [Miscellaneous Helpers](./misc-helpers#val-helper) for more details.

***

### size

Returns the size of a string, list, or map.

**Parameters:**

* First parameter: String, list, or map

**Usage:**

```handlebars  theme={null}
{{size 'abcde'}}
{{size request.query.things}}
```

See [Miscellaneous Helpers](./misc-helpers#size) for more details.

***

### with

Creates a nested scope for accessing object properties.

**Parameters:**

* First parameter: Object

**Usage:**

```handlebars  theme={null}
{{#with myObject}}
  ID: {{{id}}}
  Position: {{{position}}}
{{/with}}
```

See [Miscellaneous Helpers](./misc-helpers#with) for more details.

***

### range

Generates an array of integers between two bounds.

**Parameters:**

* First parameter: Lower bound (inclusive)
* Second parameter: Upper bound (exclusive)

**Usage:**

```handlebars  theme={null}
{{range 3 8}}
{{range -2 2}}
{{#each (range 0 (randomInt lower=1 upper=10)) as |index|}}
id: {{index}}
{{/each}}
```

See [Miscellaneous Helpers](./misc-helpers#range) for more details.

***

### array

Creates an array containing the specified values.

**Parameters:**

* Any number of values

**Usage:**

```handlebars  theme={null}
{{array 1 'two' true}}
{{array}}
```

See [Miscellaneous Helpers](./misc-helpers#array) for more details.

***

### arrayAdd

Adds an element to an array at specified position.

**Parameters:**

* First parameter: Array
* Second parameter: Element to add
* `position`: Index, `start`, or `end` (optional, defaults to end)

**Usage:**

```handlebars  theme={null}
{{arrayAdd (array 1 'three') 2 position=1}}
{{arrayAdd (array 1 'three') 2 position='start'}}
{{arrayAdd (array 1 'three') 2 position='end'}}
{{arrayAdd (array 1 'three') 2}}
```

See [Miscellaneous Helpers](./misc-helpers#array-add--remove-helpers) for more details.

***

### arrayRemove

Removes an element from an array at specified position.

**Parameters:**

* First parameter: Array
* `position`: Index, `start`, or `end` (optional, defaults to end)

**Usage:**

```handlebars  theme={null}
{{arrayRemove (array 1 2 'three') position=1}}
{{arrayRemove (array 1 2 'three') position='start'}}
{{arrayRemove (array 1 2 'three') position='end'}}
{{arrayRemove (array 1 2 'three')}}
```

See [Miscellaneous Helpers](./misc-helpers#array-add--remove-helpers) for more details.

***

### arrayJoin

Concatenates array values with a separator.

**Parameters:**

* First parameter: Separator string
* Additional parameters: Values or array to join
* `prefix`: String to prepend (optional)
* `suffix`: String to append (optional)

**Usage:**

```handlebars  theme={null}
{{arrayJoin ',' (array 'One' 'Two' 'Three')}}
{{arrayJoin ' - ' 'a' 'b' 'c'}}
{{arrayJoin ', ' (range 1 5)}}
{{arrayJoin ',' (array 'One' 'Two' 'Three') prefix='[' suffix=']'}}

{{#arrayJoin ',' myThings as |item|}}
{
  "name{{item.id}}": "{{item.name}}"
}
{{/arrayJoin}}

{{#arrayJoin ',' myThings prefix='[' suffix=']' as |item|}}
{
  "name{{item.id}}": "{{item.name}}"
}
{{/arrayJoin}}
```

See [Miscellaneous Helpers](./misc-helpers#arrayjoin-helper) for more details.

***

### hostname

Returns the hostname of the mock API.

**Usage:**

```handlebars  theme={null}
{{hostname}}
```

***

## Conditional Logic Helpers

### if

Evaluates condition and renders block if true.

**Usage:**

```handlebars  theme={null}
{{#if showDetails}}
  <div id="details">...</div>
{{/if}}

{{#if showVariantA}}
  <div id="var-a">...</div>
{{else if showVariantB}}
  <div id="var-b">...</div>
{{else}}
  <div id="default">...</div>
{{/if}}
```

See [Conditional Logic](./conditional-logic-and-iteration#conditional-logic-with-if--else-and-unless) for more details.

***

### unless

Evaluates condition and renders block if false.

**Usage:**

```handlebars  theme={null}
{{#unless hideDetails}}
  <div id="details">...</div>
{{/unless}}
```

See [Conditional Logic](./conditional-logic-and-iteration#conditional-logic-with-if--else-and-unless) for more details.

***

### eq

Tests equality.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#eq name 'Dan'}}
  <div id="dan">...</div>
{{/eq}}

{{#if (eq name 'Dan')}}
  <div id="dan">...</div>
{{/if}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### neq

Tests inequality.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#neq name 'Jeff'}}...{{/neq}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### gt

Tests greater than.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#gt itemCount 3}}...{{/gt}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### gte

Tests greater than or equal to.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#gte itemCount 3}}...{{/gte}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### lt

Tests less than.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#lt itemCount 3}}...{{/lt}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### lte

Tests less than or equal to.

**Parameters:**

* First parameter: Left value
* Second parameter: Right value

**Usage:**

```handlebars  theme={null}
{{#lte itemCount 3}}...{{/lte}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### and

Logical AND operation.

**Parameters:**

* Multiple boolean expressions

**Usage:**

```handlebars  theme={null}
{{#and (lt itemCount 10) (gt itemCount 5)}}...{{/and}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### or

Logical OR operation.

**Parameters:**

* Multiple boolean expressions

**Usage:**

```handlebars  theme={null}
{{#or (eq itemCount 1) (eq itemCount 2)}}...{{/or}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### not

Logical NOT operation.

**Parameters:**

* One boolean expression

**Usage:**

```handlebars  theme={null}
{{#not (eq itemCount 1)}}...{{/not}}
```

See [Conditional Logic](./conditional-logic-and-iteration#comparison-helpers) for more details.

***

### contains

Tests if string or array contains a value.

**Parameters:**

* First parameter: String or array
* Second parameter: Value to find

**Usage:**

```handlebars  theme={null}
{{#if (contains 'abcde' 'abc')}}YES{{/if}}
{{#if (contains (array 'a' 'b' 'c') 'a')}}YES{{/if}}

{{#contains 'abcde' 'abc'}}YES{{/contains}}
{{#contains (array 'a' 'b' 'c') 'a'}}YES{{/contains}}
```

See [Conditional Logic](./conditional-logic-and-iteration#contains-helper) for more details.

***

### matches

Tests if string matches a regular expression.

**Parameters:**

* First parameter: String to test
* Second parameter: Regular expression pattern

**Usage:**

```handlebars  theme={null}
{{#if (matches '123' '[0-9]+')}}YES{{/if}}

{{#matches '123' '[0-9]+'}}YES{{/matches}}
```

See [Conditional Logic](./conditional-logic-and-iteration#matches-helper) for more details.

***

## Iteration Helpers

### each

Iterates over collections (arrays or objects).

**Usage:**

```handlebars  theme={null}
{{#each request.query.things as |thing|}}
  thing: {{{thing}}}
{{/each}}

{{#each (jsonPath request.body '$.things') as |value key|}}
  {{{key}}}={{{value}}}
{{/each}}

{{#each (range 0 5) as |index|}}
  {{@index}}: {{index}}
  {{#if @first}}First!{{/if}}
  {{#if @last}}Last!{{/if}}
{{/each}}
```

**Special variables:**

* `@index`: Current iteration index (zero-based)
* `@first`: True if first iteration
* `@last`: True if last iteration

See [Conditional Logic](./conditional-logic-and-iteration#iteration) for more details.

***

