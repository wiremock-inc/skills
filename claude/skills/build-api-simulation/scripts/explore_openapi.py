#!/usr/bin/env python3
"""Explore an OpenAPI document: top-level info, summary stats, tags, or endpoints by tag.

Use this instead of writing ad-hoc analysis code to inspect a large spec.
"""
import sys

try:
    import yaml
except ImportError:
    print("pyyaml is required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

HTTP_METHODS = {"get", "put", "post", "delete", "options", "head", "patch", "trace"}


def load(path):
    try:
        with open(path) as f:
            return yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        print(f"Failed to parse {path}: {e}", file=sys.stderr)
        sys.exit(1)


def iter_operations(doc):
    paths = doc.get("paths", {}) if isinstance(doc, dict) else {}
    for path, path_item in paths.items():
        if not isinstance(path_item, dict):
            continue
        for method, operation in path_item.items():
            if method.lower() not in HTTP_METHODS or not isinstance(operation, dict):
                continue
            yield path, method.lower(), operation


def tags_for(operation):
    return operation.get("tags") or ["<untagged>"]


def cmd_info(doc):
    info = doc.get("info", {}) if isinstance(doc, dict) else {}
    print(f"Title: {info.get('title', '<none>')}")
    print(f"Version: {info.get('version', '<none>')}")
    print(f"Spec version: {doc.get('openapi') or doc.get('swagger', '<unknown>')}")

    description = info.get("description")
    if description:
        first_line = description.strip().splitlines()[0]
        print(f"Description: {first_line}")

    servers = doc.get("servers", [])
    if servers:
        print("Servers:")
        for server in servers:
            print(f"  {server.get('url', '?')}")
    elif doc.get("host"):
        scheme = (doc.get("schemes") or ["https"])[0]
        print(f"Host: {scheme}://{doc.get('host')}{doc.get('basePath', '')}")


def cmd_stats(doc):
    paths = doc.get("paths", {}) if isinstance(doc, dict) else {}
    operations = list(iter_operations(doc))

    tag_counts = {}
    status_codes = set()
    response_count = 0
    for _, _, operation in operations:
        for tag in tags_for(operation):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        responses = operation.get("responses", {}) or {}
        response_count += len(responses)
        status_codes.update(str(code) for code in responses.keys())

    if "components" in doc:
        schemas = (doc.get("components") or {}).get("schemas", {}) or {}
    else:
        schemas = doc.get("definitions", {}) or {}

    print(f"Paths: {len(paths)}")
    print(f"Operations: {len(operations)}")
    print(f"Responses defined: {response_count}")
    print(f"Distinct status codes: {len(status_codes)} ({', '.join(sorted(status_codes))})")
    print(f"Tags: {len(tag_counts)}")
    print(f"Schemas: {len(schemas)}")


def cmd_tags(doc):
    tag_counts = {}
    for _, _, operation in iter_operations(doc):
        for tag in tags_for(operation):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    for tag, count in sorted(tag_counts.items()):
        print(f"{tag}: {count} operation(s)")


def cmd_endpoints(doc, tag_filter=None):
    for path, method, operation in iter_operations(doc):
        tags = tags_for(operation)
        if tag_filter and tag_filter not in tags:
            continue
        op_id = operation.get("operationId", "?")
        summary = operation.get("summary", "")
        print(f"{method.upper():7} {path}  [{', '.join(tags)}]  {op_id}  {summary}")


def main():
    if len(sys.argv) < 3:
        print(
            "Usage: explore_openapi.py <path-to-openapi.yaml> <info|stats|tags|endpoints> [tag]",
            file=sys.stderr,
        )
        sys.exit(1)

    path, command = sys.argv[1], sys.argv[2]
    doc = load(path)

    if command == "info":
        cmd_info(doc)
    elif command == "stats":
        cmd_stats(doc)
    elif command == "tags":
        cmd_tags(doc)
    elif command == "endpoints":
        tag_filter = sys.argv[3] if len(sys.argv) > 3 else None
        cmd_endpoints(doc, tag_filter)
    else:
        print(f"Unknown command: {command}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
