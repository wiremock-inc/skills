#!/usr/bin/env python3
"""Sanity-check an Arazzo document: print workflowIds and their step IDs."""
import sys

try:
    import yaml
except ImportError:
    print("pyyaml is required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_arazzo.py <path-to-arazzo.yaml>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    try:
        with open(path) as f:
            doc = yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        print(f"Failed to parse {path}: {e}", file=sys.stderr)
        sys.exit(1)

    workflows = doc.get("workflows", []) if isinstance(doc, dict) else []
    print(f"Workflows: {len(workflows)}")

    for wf in workflows:
        wf_id = wf.get("workflowId", "<missing workflowId>")
        steps = wf.get("steps", [])
        step_ids = [s.get("stepId", "<missing stepId>") for s in steps]
        print(f"  {wf_id} ({len(steps)} steps): {', '.join(step_ids)}")


if __name__ == "__main__":
    main()
