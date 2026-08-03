> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Working with XML

> Working with XML

This article describes WireMock Cloud's helpers for processing and manipulating XML.

## XPath

The `xPath` helper can be used to extract values or sub documents via an XPath 1.0 expression from an XML string.
Most commonly this is used to extract values from the request body.

For example, given a request body of:

```xml  theme={null}
<outer>
    <inner>Stuff</inner>
</outer>
```

The following will render "Stuff" into the output:

```handlebars  theme={null}
{{{xPath request.body '/outer/inner/text()'}}}
```

And given the same XML the following will render `<inner>Stuff</inner>`:

```handlebars  theme={null}
{{{xPath request.body '/outer/inner'}}}
```

### Extracting attributes

XPath also permits extraction of attributes e.g. for a request body of:

```xml  theme={null}
<outer>
    <inner id="123"/>
</outer>
```

The following will render "123" into the output:

```handlebars  theme={null}
{{{xPath request.body '/outer/inner/@id'}}}
```

## SOAP XPath

As a convenience the `soapXPath` helper also exists for extracting values from SOAP bodies e.g. for the SOAP document:

```xml  theme={null}
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope/">
    <soap:Body>
        <m:a>
            <m:test>success</m:test>
        </m:a>
    </soap:Body>
</soap:Envelope>
```

The following will render "success" in the output:

```handlebars  theme={null}
{{{soapXPath request.body '/a/test/text()'}}}
```

## Iterating over XML elements

The `xPath` helper returns "one or many" collections results, which can either
be printed directly, or passed to further helpers such as [`each`](/response-templating/conditional-logic-and-iteration/#iteration) or [`join`](/response-templating/string-helpers/#join).

For instance, given a request body of the form:

```xml  theme={null}
<?xml version="1.0"?>
<stuff>
    <thing>One</thing>
    <thing>Two</thing>
    <thing>Three</thing>
</stuff>
```

and the following template:

```handlebars  theme={null}
{{#each (xPath request.body '/stuff/thing') as |element|}}{{{element.text}}} {{/each}}
```

the resulting output will be:

```
One Two Three
```

### XML element attributes

Elements in the collection returned by `xPath` have the following properties:

`text`: The text content of the element.

`name`: The element's name.

`attributes`: A map of attribute names and values e.g. given an XML element has
been selected:

```xml  theme={null}
<thing id="123" position="top"/>
```

Its attributes can be referenced:

```handlebars  theme={null}
      ID: {{{element.attributes.id}}}
Position: {{{element.attributes.position}}}
```

## Formatting XML

The `formatXml` helper allows you to output XML in either a pretty or a compact format. The default is pretty:

```handlebars  theme={null}
{{#assign 'object1'}}
<foo><bar
    >wh</bar></foo
    >
{{/assign}}
{{formatXml object1}}
```

emits:

```xml  theme={null}
<foo>
  <bar>wh</bar>
</foo>
```

Whereas

```handlebars  theme={null}
{{formatXml object1 format='compact'}}
```

emits

```xml  theme={null}
<foo><bar>wh</bar></foo>
```

The xml to format can also be supplied as a block body:

```handlebars  theme={null}
{{#formatXml}}
<foo><bar
    >wh</bar></foo
    >
{{/formatXml}}
```

