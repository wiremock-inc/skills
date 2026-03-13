> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Simulating SOAP services

> Matching SOAP requests and sending SOAP responses

Stubbing a SOAP response is similar in most respects to stubbing a REST response. The main difference is that the HTTP method
and URL alone are not enough to differentiate requests since these are always the same for a given endpoint.

In addition, we need to match on the `SOAPAction` header and the request body XML.

## Using the SOAPAction header

SOAP APIs typically use the `SOAPAction` header to select the appropriate action for the call.
Although you can sometimes avoid this, it's usually a good idea to add a header match for `SOAPAction` as it's more
efficient and faster than relying exclusively on the XML body.

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/soap-action-header.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=52dcc91f21d52d935bcedcdbff07e5ae" title="Matching the SOAPAction header" width="792" height="176" data-path="images/screenshots/soap-action-header.png" />

## Matching the request body with XML equality

When dealing with request bodies that are small and have no data of a transient nature (e.g. transaction IDs or today's date)
`equalToXml` is a straightforward way to specify a match.

For instance given a SOAP service for managing a to do list, you may wish to mock an interaction matching a specific request to add an item:

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/soap-request.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=2bcef9ed536db7fff7893c6361c12f46" title="SOAP request" width="1984" height="1566" data-path="images/screenshots/soap-request.png" />

Which returns a success response:

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/soap-response.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=202bd95ca2e769d2b19685c049f4024d" title="SOAP response" width="1986" height="970" data-path="images/screenshots/soap-response.png" />

Testing this returns the expected XML response:

```
$ curl -X POST -d '<?xml version="1.0"?>
<soap-env:Envelope xmlns:soap-env="http://www.w3.org/2001/12/soap-envelope" soap-env:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

   <soap-env:Body xmlns:m="http://example.company/todo" >
      <m:AddToDoItem>
         <m:ToDoItem>Have a wash</m:ToDoItem>
      </m:AddToDoItem>
   </soap-env:Body>

</soap-env:Envelope>' -H 'SOAPAction: "http://example.company/todo/AddToDoItem"' http://example.wiremockapi.cloud/soap-example -v

> POST /soap-example HTTP/1.1
> Host: example.wiremockapi.cloud
> User-Agent: curl/7.54.0
> Accept: */*
> SOAPAction: "http://example.company/todo/AddToDoItem"
> Content-Length: 355
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 355 out of 355 bytes
< HTTP/1.1 200 OK
< Transfer-Encoding: chunked
<
<?xml version="1.0"?>
<soap-env:Envelope xmlns:soap-env="http://www.w3.org/2001/12/soap-envelope" soap-env:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

   <soap-env:Body xmlns:m="http://example.company/todo" >
      <m:AddToDoResult>Item "Have a wash" successfully added</m:AddToDoResult>
   </soap-env:Body>

</soap-env:Envelope>
```

### Using placeholders to ignore transient values

The above example works fine when the request body doesn't contain any transient data
such as transaction IDs or the current date. However, if data that changes on each
request is introduced it will be necessary allow a match to occur regardless of the
actual value received.

One way to do this is to use [placeholders](./advanced-stubbing/#xml-placeholders).
Let's assume the request body of our API now contains a `TransactionId` element, which
must be a unique value for each request e.g.:

```xml  theme={null}
<?xml version="1.0"?>
<soap-env:Envelope xmlns:soap-env="http://www.w3.org/2001/12/soap-envelope"
  soap-env:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

   <soap-env:Body xmlns:m="http://example.company/todo">
      <m:TransactionId>1ea094dd-9548-4a79-a43c-b44670f955c6</m:TransactionId>
      <m:AddToDoItem>
         <m:ToDoItem>Have a wash</m:ToDoItem>
      </m:AddToDoItem>
   </soap-env:Body>

</soap-env:Envelope>
```

We can ignore this value by ticking the "Enable XMLUnit placeholders" box and
putting an ignore token into the expected XML in the form:

```xml  theme={null}
<m:TransactionId>${xmlunit.ignore}</m:TransactionId>
```

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/soap-placeholders.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=dc87c675a8221f43f322f55b2610ff96" title="SOAP request XML with placeholders" width="1948" height="570" data-path="images/screenshots/soap-placeholders.png" />

## Matching the request body with XPath

When working with large SOAP requests `equalToXml` can become quite slow as it must perform a comparison on every node in the XML document.

It's often faster to match specific elements within the document using the `matchesXPath` operator,
and since this is a much looser approach to matching it's another way to solve
the problem described above where frequently changing values are present.

When matching using XPath, your aim should be to target as few elements/attributes as possible while being able
to reliably distinguish between requests.

Given the same request body as in the previous section, we could use the following
XPath to match just on the value of the `m:ToDoItem` element:

```xpath  theme={null}
//AddToDoItem/ToDoItem[text()='Have a wash']
```

<img src="https://mintcdn.com/wiremockinc/0mURIwCv-YEN_f3M/images/screenshots/xpath-soap-match.png?fit=max&auto=format&n=0mURIwCv-YEN_f3M&q=85&s=a20616411f2e889a3f51684374e94b93" title="Matching with XPath" width="1954" height="312" data-path="images/screenshots/xpath-soap-match.png" />

### Using multiple XPath expressions

Sometimes you need to match on more than one XML element to be able to adequately
distinguish between requests. Although XPath supports multiple predicates with logical and/or,
often it can be easier to use multiple body matchers each targeting a single element.

Suppose we added a `UserId` field that we also wanted to target:

```xml  theme={null}
<?xml version="1.0"?>
<soap-env:Envelope xmlns:soap-env="http://www.w3.org/2001/12/soap-envelope"
  soap-env:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

   <soap-env:Body xmlns:m="http://example.company/todo">
      <m:TransactionId>1ea094dd-9548-4a79-a43c-b44670f955c6</m:TransactionId>
      <m:UserId>abc123</m:UserId>
      <m:AddToDoItem>
         <m:ToDoItem>Have a wash</m:ToDoItem>
      </m:AddToDoItem>
   </soap-env:Body>

</soap-env:Envelope>
```

We could add one `matchesXPath` body pattern for each of the elements we
care about:

<img src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/multiple-xpath-soap-match.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=4ab6dd288262ecf6907742ce02a34dc8" title="Matching with multiple XPaths" width="1912" height="616" data-path="images/screenshots/multiple-xpath-soap-match.png" />

### A gotcha - the recursive selector: //

Given the above XML document, you might expect the following XPath expression to
produce a match:

```xpath  theme={null}
//UserId[text()='abc123']
```

However, due to a quirk of how XML documents with namespaces are evaluated this won't work.
Ensuring that you select at least one node beneath the element searched for recursively
will fix this, so the above XPath can be corrected like this:

```xpath  theme={null}
//UserId/text()[.='abc123']
```

