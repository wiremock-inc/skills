#!/usr/bin/env python3
"""Sanity-check an OpenAPI document: print the path count and operationIds."""
import sys

try:
    import yaml
except ImportError:
    print("pyyaml is required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_openapi.py <path-to-openapi.yaml>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    try:
        with open(path) as f:
            doc = yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        print(f"Failed to parse {path}: {e}", file=sys.stderr)
        sys.exit(1)

    paths = doc.get("paths", {}) if isinstance(doc, dict) else {}
    print(f"Paths: {len(paths)}")

    operation_ids = []
    for path_item in paths.values():
        if not isinstance(path_item, dict):
            continue
        for operation in path_item.values():
            if isinstance(operation, dict) and "operationId" in operation:
                operation_ids.append(operation["operationId"])

    print(f"Operations: {len(operation_ids)}")
    for op_id in operation_ids:
        print(f"  {op_id}")


if __name__ == "__main__":
    main()
