> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Dates and Times

> Working with dates and times

WireMock Cloud has two helpers for manipulating dates - `now` and `date`.

## Current date/time

The `now` helper renders the current date/time, with the ability to specify the format (see [full reference](#format-string-reference)) and offset.

```handlebars  theme={null}
{{now}}
{{now offset='3 days'}}
{{now offset='-24 seconds'}}
{{now offset='1 years'}}
{{now offset='10 years' format='yyyy-MM-dd'}}
```

Dates can be rendered in a specific timezone (the default is UTC):

```handlebars  theme={null}
{{now timezone='Australia/Sydney' format='yyyy-MM-dd HH:mm:ssZ'}}
```

Pass `epoch` as the format to render the date as UNIX epoch time (in milliseconds), or `unix` as the format to render
the UNIX timestamp in seconds.

```handlebars  theme={null}
{{now offset='2 years' format='epoch'}}
{{now offset='2 years' format='unix'}}
```

## Random date values

You can combine the `now` helper with [random helpers](./random-values#random-numbers) to generate random dates:

```handlebars  theme={null}
{{now offset=(join (randomInt lower=-365 upper=365) ' days' '')}} // a date somewhere between a year ago and a year in the future
```

## Existing date values

The `date` helper can be used to manipulate existing date values, changing the
offset, timezone and print format in exactly the same manner as with the `now` helper.

```handlebars  theme={null}
{{date myDate offset='-1 days' timezone='America/New_York' format='yyyy-MM-dd'}}
```

## Parsing dates from strings

Dates can be parsed from other model elements. This is mostly useful when passed to
the `date` helper for further processing:

```handlebars  theme={null}
{{date (parseDate request.headers.MyDate) offset='-1 days'}}
```

### Specifying parser format

You can specify the format to use when parsing a date via a [format string](#format-string-reference):

```handlebars  theme={null}
{{parseDate '10/11/2021' format="dd/MM/yyyy"}}
```

Output: `2021-11-10T00:00:00Z`.

Additionally you can specify `unix` or `epoch` as the format which will interpret
parse a large integer denoting (respectively) seconds or milliseconds since 1st of January 1970:

```handlebars  theme={null}
{{parseDate '1577964091000' format="epoch"}}
```

Output: `2020-01-02T11:21:31Z`.

## Formatting dates

Date values can be formatted to strings using the `dateFormat` helper. You can
either select a named format from the following:

* `full`: full date format. For example: Tuesday, June 19, 2012
* `long`: long date format. For example: June 19, 2012
* `medium`: medium date format. For example: Jun 19, 2012
* `short`: short date format. For example: 6/19/12

e.g.

```handlebars  theme={null}
{{dateFormat (parseDate '2020-01-01T11:11:11Z') 'full'}} // Wednesday, January 1, 2020
```

Or you can specify your own format string ([full reference here](#format-string-reference)):

```handlebars  theme={null}
{{dateFormat (parseDate '2020-01-01T11:11:11Z') format='yyyy-MM-dd'}} // 2020-01-01
```

## Format string reference

The following details all of the format string elements used when formatting and parsing dates and times:

| Letter | Date or Time Component                           | Presentation       | Examples                                |
| ------ | ------------------------------------------------ | ------------------ | --------------------------------------- |
| G      | Era designator                                   | Text               | AD                                      |
| y      | Year                                             | Year               | 1996 (yyyy); 96 (yy)                    |
| Y      | Week year                                        | Year               | 2009 (YYYY); 09 (YY)                    |
| M      | Month in year                                    | Month              | July (MMMM); Jul (MMM); 07 (MM)         |
| w      | Week in year                                     | Number             | 27                                      |
| W      | Week in month                                    | Number             | 2                                       |
| D      | Day in year                                      | Number             | 189                                     |
| d      | Day in month                                     | Number             | 10                                      |
| F      | Day of week in month                             | Number             | 2                                       |
| E      | Day name in week                                 | Text               | Tuesday (EEEEEE); Tue (EEE)             |
| u      | Day number of week (1 = Monday, ..., 7 = Sunday) | Number             | 1                                       |
| a      | Am/pm marker                                     | Text               | PM                                      |
| H      | Hour in day (0-23)                               | Number             | 0                                       |
| k      | Hour in day (1-24)                               | Number             | 24                                      |
| K      | Hour in am/pm (0-11)                             | Number             | 0                                       |
| h      | Hour in am/pm (1-12)                             | Number             | 12                                      |
| m      | Minute in hour                                   | Number             | 30                                      |
| s      | Second in minute                                 | Number             | 55                                      |
| S      | Millisecond                                      | Number             | 978                                     |
| z      | Time zone                                        | General time zone  | Pacific Standard Time (zzzz); PST (zzz) |
| Z      | Time zone                                        | RFC 822 time zone  | -0800                                   |
| X      | Time zone                                        | ISO 8601 time zone | -08 (X); -0800 (XX);  -08:00 (XXX)      |

## Truncating dates

The `truncateDate` helper will truncate date/times to specific points e.g.

```handlebars  theme={null}
{{truncateDate (parseDate '2021-06-14T00:00:00Z') 'last day of month'}}
```

Output: `Wed Jun 30 00:00:00 UTC 2021`.

The full list of available truncations is:

* `first minute of hour`
* `first hour of day`
* `first day of month`
* `first day of next month`
* `last day of month`
* `first day of year`
* `first day of next year`
* `last day of year`

