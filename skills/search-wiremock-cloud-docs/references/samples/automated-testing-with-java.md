> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Automated Testing with Java

> Creating automated tests in Java and WireMock Cloud

Everything that can be done with WireMock Cloud's web UI can also be done via its APIs. This can be useful when automating
testing, as it allows stubs to be configured and torn down on-demans by individual test cases rather than it being
necessary to configure an entire test suite's stubs manually up-front. Working this way can make your tests a lot more
readable as it makes their preconditions explicit.

WireMock Cloud's API is 100% compatible with [WireMock's](http://wiremock.org/docs/api/). This means that WireMock
can be used as a Java client for WireMock Cloud.

## Adding WireMock to your project

WireMock is distributed in two different types of JAR - a standard "thin" JAR, and a "fat" standalone JAR. The latter of these
contains all of WireMock's dependencies and repackages (shades) most of these. Either can be used as a dependency in your
project and which you choose depends primarily on whether you have dependencies already present that conflict with WireMock's.
Picking the standalone version generally avoids these problems but at the cost of a larger JAR download.

If you're using Gradle you can add WireMock to your build file's dependencies as follows. Choose one of:

```
testImplementation 'org.wiremock:wiremock:3.12.1' // thin JAR
testImplementation 'org.wiremock:wiremock-standalone:3.12.1' // standalone JAR
```

Or if you're using Maven, choose one of:

```xml  theme={null}
<!-- Thin JAR -->
<dependency>
    <groupId>org.wiremock</groupId>
    <artifactId>wiremock</artifactId>
    <version>3.12.1</version>
    <scope>test</scope>
</dependency>

<!-- Standalone JAR -->
<dependency>
    <groupId>org.wiremock</groupId>
    <artifactId>wiremock-standalone</artifactId>
    <version>3.12.1</version>
    <scope>test</scope>
</dependency>
```

## Configuring your test

After you've created a mock API in the WireMock Cloud UI, setting up a WireMock client to it is a one-line task (you can copy-paste this from
your mock API's Settings page):

```java  theme={null}
// If admin API security disabled
WireMock paymentGatewayMock = new WireMock("https", "payments-example.wiremockapi.cloud", 443);

// If admin API security enabled
WireMock paymentGatewayMock = new WireMockBuilder()
    .scheme("https")
    .host("payments-example.wiremockapi.cloud")
    .port(443)
    .authenticator(new ClientTokenAuthenticator("lksdr91283rsdjkfh981"))
    .build();
```

Then in your test cases you can create stubs as [documented on the WireMock site](http://wiremock.org/docs/stubbing/):

```java  theme={null}
paymentGatewayMock.register(post("/send-payment").willReturn(created()));
```

And make assertions about received requests:

```java  theme={null}
paymentGatewayMock.verifyThat(postRequestedFor(urlPathEqualTo("/send-payment")));
```

## Programmatic stub creation

The same approach can be taken if you want to create stubs in your API programmatically.
This can be useful when you require a large number of stubs and don't want to create
them all by hand.

The example in the previous section creates an ephemeral stub i.e. one that isn't
stored persistently and will be deleted when the API is reset. To ensure that stubs
created programmatically are saved, simply call `persistent()` during creation:

```java  theme={null}
myMockApi.register(get(urlPathEqualTo("/persist-this"))
    .persistent()
    .willReturn(ok("Some body content"))
);
```

## Example project

For a complete, working example of a Java web project using WireMock Cloud with automated tests see [the WireMock Cloud demo app](https://github.com/wiremock/wiremock-cloud-demo-app).

