#!/usr/bin/env python3
"""Sanity-check a stub mappings file: print mapping count and a method/path/status summary."""
import sys

try:
    import yaml
except ImportError:
    print("pyyaml is required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_stub_mappings.py <path-to-stub-mappings.yaml>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    try:
        with open(path) as f:
            doc = yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        print(f"Failed to parse {path}: {e}", file=sys.stderr)
        sys.exit(1)

    if isinstance(doc, list):
        mappings = doc
    elif isinstance(doc, dict):
        mappings = doc.get("mappings", [])
    else:
        mappings = []

    print(f"Mappings: {len(mappings)}")

    for mapping in mappings:
        name = mapping.get("name", "<unnamed>")
        request = mapping.get("request", {})
        method = request.get("method", "?")
        url = (
            request.get("urlPathTemplate")
            or request.get("urlPath")
            or request.get("url")
            or request.get("urlPattern")
            or "?"
        )
        status = mapping.get("response", {}).get("status", "?")
        print(f"  {method} {url} -> {status}  ({name})")


if __name__ == "__main__":
    main()
