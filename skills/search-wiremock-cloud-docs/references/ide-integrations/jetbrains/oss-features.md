> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Support for WireMock OSS

> Features supporting the OSS (non-WireMock Cloud) side of WireMock

## Create WireMock stubs

### Create basic WireMock stub from scratch

If a JSON file is placed in the **mappings** folder or contains the `"mappings"` key, the plugin recognizes it as a WireMock stub file and provides appropriate coding assistance.

1. In the **Project** tool window, right-click a folder (or press <kbd>⌘Сmd</kbd><kbd>N</kbd> or <kbd>Alt</kbd><kbd>Insert</kbd>) and select **New | File**.
2. In the **New File** dialog that opens, enter a name of the file. For example, you can enter `mappings/my-stub.json`, and the plugin will create the **mappings** folder and place the new file within it.
3. Start typing a key to get suggestions for applicable keys and their quick documentation.

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/mappings_property_completion.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=d244a1a9070d1a057bfb3e22f6a4e913" alt="WireMock Coding Assistance" width="1364" height="836" data-path="images/ides/jetbrains/mappings_property_completion.png" />

### Create WireMock stubs from Endpoints tool window

1. Open the **Endpoints** tool window (**View | Tool Windows | Endpoints**).
2. Right-click an endpoint and select **Generate WireMock Stubs**.

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/generate_stubs_from_endpoints.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=c4cdd73259c7fe7299fefe5778ced77e" width="550" alt="Creating WireMock stub from Endpoints" data-path="images/ides/jetbrains/generate_stubs_from_endpoints.png" />

The new stub file is saved as a [scratch](https://www.jetbrains.com/help/idea/scratches.html) under **Scratches and Consoles | WireMock Stubs**.

### Create WireMock stubs from OpenAPI specification

1. Open an OpenAPI specification file.
2. Click <img src="https://resources.jetbrains.com/help/img/idea/2025.3/app-client.expui.gutter.run.svg" style={{display: 'inline-block', margin: 'inherit'}} /> and select **Generate WireMock Stubs**.

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/generate_stubs_from_openapi_spec.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=0bfb3e1f4e4791e778d095428e76fe67" width="550" alt="Creating WireMock stub from OpenAPI Specs" data-path="images/ides/jetbrains/generate_stubs_from_openapi_spec.png" />

The new stub file is saved as a [scratch](https://www.jetbrains.com/help/idea/scratches.html) under **Scratches and Consoles | WireMock Stubs**.

## Run WireMock server

1. Open your stub file.
2. Click <img src="https://resources.jetbrains.com/help/img/idea/2025.3/app-client.expui.webReferences.server.svg" alt="Run WireMock" style={{display: 'inline-block', margin: 'inherit'}} /> in the upper-right part of the editor.

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/run-wiremock-server.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=097393e79874f5c4b1ffc94786a9a537" width="550" alt="Run WireMock server" data-path="images/ides/jetbrains/run-wiremock-server.png" />

This will start the WireMock server, and you can see it running in the **Services** tool window (**View | Tool Windows | Services** or press <kbd>⌘Сmd</kbd><kbd>8</kbd> or <kbd>Alt</kbd><kbd>8</kbd>).

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/running-wiremock-server-services-tool-window.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=7a5ec31980249b1d5c1a28617dc78c50" alt="A running WireMock server in the Services tool window" width="1864" height="682" data-path="images/ides/jetbrains/running-wiremock-server-services-tool-window.png" />

To customize how IntelliJ IDEA starts the WireMock server, you can [modify the WireMock run configuration](#wiremock-run-configuration) or create a new one.

## Send HTTP requests

Use the IntelliJ IDEA [HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) to send HTTP request to the WireMock server and preview responses.

1. [Run your WireMock server.](#run-wiremock-server)
2. Open your stub JSON file.
3. Place the caret at your endpoint URL, press <kbd>⌥Option</kbd><kbd>↩Enter</kbd> or <kbd>Alt</kbd><kbd>↩Enter</kbd> (**Show Context Actions**), and select **Generate request in HTTP Client**.

You can view the stub response in the **Services** tool window.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-send-http-request.gif?s=71c826f93d028aad0a97a6ee688da964" width="900" alt="WireMock send HTTP request" data-path="images/ides/jetbrains/wiremock-send-http-request.gif" />

## Enable support for Handlebars templates

IntelliJ IDEA provides coding assistance for templating language used in WireMock response templates. To use this feature, you need the [Handlebars/Mustache](https://plugins.jetbrains.com/plugin/6884-handlebars-mustache) plugin to be installed and enabled.

1. Open your stub JSON file.
2. In the upper-right part of the editor, click <img src="https://resources.jetbrains.com/help/img/idea/2025.3/handlebarsJson.svg" style={{display: 'inline-block', margin: 'inherit'}} /> (**Use Handlebars Templates**). If the [Handlebars/Mustache](https://plugins.jetbrains.com/plugin/6884-handlebars-mustache) plugin is not installed, the action will install it.

This will make IntelliJ IDEA treat JSON files placed in the `__files` directory as response templates and provide appropriate Handlebars coding assistance including completion for [Handlebars helpers](https://wiremock.org/docs/response-templating/#handlebars-helpers).

<img src="https://mintcdn.com/wiremockinc/aVMhpBIMjELNN2Qr/images/ides/jetbrains/enable-support-for-handlebars-templates.png?fit=max&auto=format&n=aVMhpBIMjELNN2Qr&q=85&s=732352d5623f45163036b6e9b29f50ea" alt="Enable support for Handlebars templates" width="1538" height="1194" data-path="images/ides/jetbrains/enable-support-for-handlebars-templates.png" />

## WireMock run configuration

<Info>Create: Run | Edit Configurations | + | WireMock</Info>

IntelliJ IDEA comes with a dedicated **WireMock** run configuration, which allows you to customize how to start the WireMock server.

<img src="https://mintcdn.com/wiremockinc/X5ETVmm7Bk8h2cuW/images/ides/jetbrains/wiremock-run-configuration.png?fit=max&auto=format&n=X5ETVmm7Bk8h2cuW&q=85&s=b3ca80cc341e1dac470e24f5c89985ec" alt="WireMock run configuration" width="1568" height="1212" data-path="images/ides/jetbrains/wiremock-run-configuration.png" />

### Main parameters

* **Name**: Specify a name for the run configuration.
* **Stubs file**: Location of the JSON file with WireMock stubs to run.
* **Server port**: HTTP port number for the WireMock server. Enter `0` to dynamically determine a port.

### Modify options

* **Verbose output**: Turn on verbose logging to stdout (equivalent for the `--verbose` option).
* **Enable global Handlebars templating**: Render all response definitions using Handlebars templates by passing the `--global-response-templating` [WireMock command line option](https://wiremock.org/docs/standalone/java-jar/#command-line-options).
* **JRE**: Select a JRE if you wish to run WireMock in a different runtime environment than JBR.

### Logs

Specify which log files generated while running the application should be displayed in the console on the dedicated tabs of the [Run](https://www.jetbrains.com/help/idea/2025.3/run-tool-window.html) tool window.

### Before launch

Select tasks to be performed before starting the selected run/debug configuration.

