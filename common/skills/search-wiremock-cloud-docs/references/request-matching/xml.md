> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Request Matching - Matching XML bodies

> Matching XML

When stubbing API functions that accept XML request bodies we may want to
return different responses based on the XML sent. WireMock Cloud provides two match types
to supports this case - `equalToXml` and `matchesXPath`, which are described
in detail in this article.

## Matching via XML equality - `equalToXml`

The `equalToXml` match operator performs a semantic comparison of the input XML
against the expected XML. This has a number of advantages over a straight string
comparison:

* Ignores differences in whitespace
* Ignores element and attribute order
* Supports placeholders so that specific elements or attributes can be excluded from the comparison

By default `equalToXml` will match the input to the expected XML if all elements
and attributes are present, have the same value and there are no additional
elements or attributes.

For instance, given the following configuration:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/equal-to-xml.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=174657a8a9a6aeb833c28a263ed6225b" title="Default equal to XML" width="793" height="224" data-path="images/screenshots/equal-to-xml.png" />

The following XML would match:

```xml  theme={null}
<things>
  <two id="234" val="2"/>
  <one val="1" id="123" />

</things>
```

### Using placeholders to ignore specific elements or attributes

As with JSON equality matching, placeholders can be used with XML to ignore specific
elements or attributes.

Given the following configuration:

<img src="https://mintcdn.com/wiremockinc/m5hvbZSijetQGAV3/images/screenshots/equal-to-xml-with-placeholders.png?fit=max&auto=format&n=m5hvbZSijetQGAV3&q=85&s=9379522e48a2d31bb646a0676d053cf2" title="Equal to XML with placeholders" width="793" height="236" data-path="images/screenshots/equal-to-xml-with-placeholders.png" />

The following XML will match:

```xml  theme={null}
<things>
  <one id="123" val="123456789"/>
  <two id="234" val="2"/>
  <three>999999</three>
</things>
```

## Matching via XPath - `matchesXPath`

WireMock Cloud supports matching incoming XML using XPath 1.0 expressions. The most common
use case for this is when accepting XML request bodies, although it can be used
with other request fields such as headers.

The input XML is deemed a match if any elements are returned when the XPath
expression is evaluated against it.

Given a body match on the XPath expression `/things/thing[@name = 'socks']`.

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/xpath-body-match.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=42fc2c25521b88938b6157ac96b97037" title="Matching on XPath" width="795" height="159" data-path="images/screenshots/xpath-body-match.png" />

The following XML will match:

```xml  theme={null}
<things>
  <thing name="socks"></thing>
  <thing name="shoes"></thing>
</things>
```

