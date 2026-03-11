> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Request Matching - Overview of Matcher Types

> Overview of the match operations supported by WireMock Cloud

WireMock Cloud (via WireMock) supports a set of match operations that can be used against
the request's query, headers, cookies and body.

This article provides an overview of these matchers. The names shown are the exact
keys used in the WireMock/WireMock Cloud JSON API.

## `equalTo`

Only matches if the input string is exactly equal to the expected value.

## `binaryEqualTo`

Like `equalTo` but compares bytes rather than strings. Useful when you need to match
e.g. an uploaded image.

## `matches`

Matches the input string against a [Java style regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

## `doesNotMatch`

The negative of `matches`. Will match if the incoming value does **not** match the regular expression.

## `contains`

Matches if the input string contains the expected value.

## `doesNotContain`

The negative of `contains`. Will match if the input string does **not** contain the expected value.

## `equalToJson`

Matches if the input string is valid JSON and is semantically equal to the expected value.
This is often a better choice than `equalTo` when dealing with JSON as it will ignore
differences in whitespace, and it is optionally possible to ignore array orderings
and extra object attributes. It also provides the concept of placeholders, allowing
you to selectively ignore or merely constrain specific JSON elements.

The underlying implementation for `equalToJson` is supplied by
[JSONUnit](https://github.com/lukas-krecan/JsonUnit).

You can learn more about working with JSON in the [Matching JSON](./json/) article.

## `matchesJsonPath`

Tests the input JSON string against a JSONPath expression, and returns a match if
one or more elements are returned. No match will be returned if the input is not valid
JSON.

The actual JSONPath evaluation is performed by the [Java JSONPath implementation](https://github.com/json-path/JsonPath).

## `equalToXml`

Matches if the input string is valid XML and is semantically equal to the expected value.
Like with `matchesJsonPath` this ignores differences in whitespace and supports placeholders
so that specific element values can be ignored.

The underlying implementation for `equalToXml` is supplied by
[XMLUnit](https://www.xmlunit.org/).

You can learn more about working with XML in the [Matching XML](./xml/) article.

## `matchesXPath`

Tests the input XML string against an XPath 1.0 expression, and returns a match if
one or more elements are returned. No match will be returned if the input is not valid
XML.

## `before, after and equals(date/time)`

Tests the input matches a date/time. Date/times can be Absolute or Relative and the expected format can also be configured using Java's date time format.

### `before`

The date/time must be **before** the expected date config.

### `after`

The date/time must be **after** the expected date config.

### `equals (date/time)`

The date/time must exactly match the expected date config.

You can read more about the possible configure options available for [wiremock here](https://wiremock.org/docs/request-matching/#dates-and-times)

You can match numbers in their String representation using `equalTo`. For matching based on their numeric value, use
the following matchers:

### `equalToNumber`

For matching based on a numeric value.

### `greaterThanNumber`

For matching based on whether a numeric value is greater than the expected value.

### `greaterThanEqualNumber`

For matching based on whether a numeric value is greater than or equal to the expected value.

### `lessThanNumber`

For matching based on whether a numeric value is less than the expected value.

### `lessThanEqualNumber`

For matching based on whether a numeric value is less than or equal to the expected value.

These matchers always report inputs that cannot be parsed to a number as not matching. It can be used for matching both strings and numbers.

