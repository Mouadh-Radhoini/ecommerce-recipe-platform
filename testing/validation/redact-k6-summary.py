"""Export k6 measurements without the setup object that contains the fixture JWT."""
from pathlib import Path
import json
import sys

source, destination = map(Path, sys.argv[1:])
report = json.loads(source.read_text())
report.pop("setup_data", None)
destination.write_text(json.dumps(report, indent=2) + "\n")
