> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock Runner Serve Mode Extensions

> How to extend the WireMock Runner's Serve Mode

## Extending the WireMock Runner

The behaviour of the WireMock Runner's [`serve` mode](/runner/serve) can be extended in the same way as [WireMock OSS](https://wiremock.org/docs/extending-wiremock/),
allowing custom request matching, filtering, and response transforming, to name a few of the available capabilities.

The WireMock Runner supports all the available OSS extension points, allowing you to lift and shift your existing extensions directly into the Runner without any code changes.

## Usage

Extensions are loaded into the WireMock Runner on startup via [Java's service loader framework](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ServiceLoader.html).
To execute your custom extensions in the WireMock Runner, compile your extension code into one or more `.jar` files and place these files into an `extensions` directory inside your `.wiremock` directory.
Each extension must have a relevant entry in its jar's extension service file.
For example, if your jar file contains a `RequestFilterV2` extension whose qualified class name is `com.example.MyRequestFilter`, the jar's `/META-INF/services/com.github.tomakehurst.wiremock.extension.Extension` file must contain the entry `com.example.MyRequestFilter`.

If your extensions are configured via an `ExtensionFactory`, these can be loaded into the Runner by placing the qualified name of the factory into the jar's `/META-INF/services/com.github.tomakehurst.wiremock.extension.ExtensionFactory` file.

## Examples

As a simple example to demonstrate loading extensions into the Runner, we'll create an extension that will count how many requests have been made to a service, and another extension to report that number via a custom admin API endpoint.
Here is all the code required for the extensions:

```java RequestCountingAdminApiExtensionFactory.java theme={null}
package com.example;

import com.github.tomakehurst.wiremock.admin.Router;
import com.github.tomakehurst.wiremock.extension.AdminApiExtension;
import com.github.tomakehurst.wiremock.extension.Extension;
import com.github.tomakehurst.wiremock.extension.ExtensionFactory;
import com.github.tomakehurst.wiremock.extension.Parameters;
import com.github.tomakehurst.wiremock.extension.ServeEventListener;
import com.github.tomakehurst.wiremock.extension.WireMockServices;
import com.github.tomakehurst.wiremock.http.Body;
import com.github.tomakehurst.wiremock.http.RequestMethod;
import com.github.tomakehurst.wiremock.http.ResponseDefinition;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class RequestCountingAdminApiExtensionFactory implements ExtensionFactory {
    @Override
    public List<Extension> create(WireMockServices services) {
        var count = new AtomicInteger(0);
        return List.of(new RequestCountingAdminApi(count), new RequestCounter(count));
    }

    static class RequestCounter implements ServeEventListener {
        private final AtomicInteger count;

        public RequestCounter(AtomicInteger count) {
            this.count = count;
        }

        @Override
        public String getName() {
            return "request-counter";
        }

        public void afterComplete(ServeEvent serveEvent, Parameters parameters) {
            count.incrementAndGet();
        }
    }

    static class RequestCountingAdminApi implements AdminApiExtension {
        private final AtomicInteger count;

        public RequestCountingAdminApi(AtomicInteger count) {
            this.count = count;
        }

        public String getName() {
            return "request-counting-admin-api";
        }

        @Override
        public void contributeAdminApiRoutes(Router router) {
            router.add(RequestMethod.GET, "/request-count", (admin, serveEvent, pathParams) ->
                    new ResponseDefinition.Builder().setStatus(200).setBody(new Body(Integer.toString(count.get()))).build());
        }
    }
}
```

Place this code into a file in your working directory, along with a `META-INF/services/com.github.tomakehurst.wiremock.extension.ExtensionFactory` file with the following content:

```
com.example.RequestCountingAdminApiExtensionFactory
```

These files can be compiled to a jar file using the following commands:

```shell  theme={null}
javac -d . -cp <WIREMOCK_CORE_CLASSPATH_FILES...> RequestCountingAdminApiExtensionFactory.java
jar cf request-counting.jar com META-INF
```

<Note>
  The simplest way to obtain the appropriate WireMock core classpath files is to download the WireMock OSS standalone jar from [the Maven Central repository](https://repo.maven.apache.org/maven2/org/wiremock/wiremock-standalone/).
</Note>

For simplicity, this example uses off-the-shelf `java*` commands to compile a jar, but most extension projects will use a build tool like Gradle or Maven to generate the appropriate jar file(s).
Examples of extension projects that use Gradle and Maven build tools are [the WireMock JWT extension](https://github.com/wiremock/wiremock-jwt-extension) and [the WireMock GraphQL extension](https://github.com/wiremock/wiremock-graphql-extension).

Once you have your jar file, place it in an `extensions` directory inside your `.wiremock` directory.
Now start up the Runner in `serve` mode and make some requests to your services.
Each service should now expose a custom admin API endpoint at `GET /__admin/request-count` that returns the number of requests that service has received.

```shell  theme={null}
curl http://localhost:8080/things/1
curl http://localhost:8080/things/2
curl http://localhost:8080/things/3

curl http://localhost:8080/__admin/request-count
3
```

## Classpath isolation

Note that extension classes are loaded in an isolated fashion, meaning they do not have access to any classes not explicitly supplied in the `extensions` directory, with the exception of the WireMock core classes.
Thus, if your extensions depend on [Jackson](https://github.com/FasterXML/jackson) for example, the appropriate Jackson jars must be supplied in the `extensions` directory.
If WireMock core classes are supplied in the `extensions` directory, these will be ignored in favour of the WireMock core classes supplied by the Runner.

