#!/usr/bin/env python3
from pathlib import Path
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "VERSION", "PROJECT_BRAIN.md", "AGENTS.md",
    "docs/product/manifesto.md", "docs/product/product-vision.md",
    "docs/product/development-roadmap.md",
    "docs/engineering/engineering-bible.md",
    "docs/engineering/ai-engineering-bible.md",
    "docs/adr/architecture-decisions.md",
    "ai/START_NEW_SESSION.md", "ai/state/CURRENT_STATE.md",
    "ai/state/NEXT_TASK.md", "ai/state/PROJECT_STATE.json",
    "ai/state/SESSION_LOG.md",
]
FORBIDDEN = [
    "ai/SUPER_CURSOR_PROMPT.md", "ai/rules", "SHA256SUMS.txt",
    "ai/state/ACTIVE_CONTEXT.md", "ai/state/AI_STATUS.md",
    "ai/state/DECISIONS.json", "ai/state/KNOWN_PROBLEMS.md",
    "ai/state/MODULE_STATUS.json", "ai/state/PROGRESS_DIGEST.md",
    "ai/state/TASK_QUEUE.json", "docs/engineering/cursor-rules-reference.md",
]
errors=[]
for rel in REQUIRED:
    p=ROOT/rel
    if not p.exists(): errors.append(f"Missing: {rel}")
    elif p.is_file() and p.stat().st_size==0: errors.append(f"Empty: {rel}")
for rel in FORBIDDEN:
    if (ROOT/rel).exists(): errors.append(f"Obsolete duplicate remains: {rel}")
for p in ROOT.rglob("*.docx"):
    errors.append(f"Binary documentation must stay outside Git: {p.relative_to(ROOT)}")
try:
    state=json.loads((ROOT/"ai/state/PROJECT_STATE.json").read_text(encoding="utf-8"))
except Exception as exc:
    errors.append(f"Invalid PROJECT_STATE.json: {exc}")
    state={}
version=(ROOT/"VERSION").read_text(encoding="utf-8").strip() if (ROOT/"VERSION").exists() else ""
if state.get("repository_version") != version:
    errors.append(f"Version mismatch: VERSION={version!r}, PROJECT_STATE={state.get('repository_version')!r}")
next_task=(ROOT/"ai/state/NEXT_TASK.md").read_text(encoding="utf-8") if (ROOT/"ai/state/NEXT_TASK.md").exists() else ""
current_id=state.get("current_task",{}).get("id")
if current_id and current_id not in next_task:
    errors.append(f"NEXT_TASK does not name active task {current_id}")
brain=(ROOT/"PROJECT_BRAIN.md").read_text(encoding="utf-8") if (ROOT/"PROJECT_BRAIN.md").exists() else ""
if "Canonical conflict rule" not in brain:
    errors.append("Canonical conflict rule missing from PROJECT_BRAIN.md")
context=(ROOT/"ai/context/PROJECT_CONTEXT.md").read_text(encoding="utf-8") if (ROOT/"ai/context/PROJECT_CONTEXT.md").exists() else ""
if re.search(r"## Authority", context):
    errors.append("Competing Authority section remains in PROJECT_CONTEXT.md")
road=(ROOT/"docs/product/development-roadmap.md").read_text(encoding="utf-8") if (ROOT/"docs/product/development-roadmap.md").exists() else ""
if "единственный канонический roadmap" not in road:
    errors.append("Canonical roadmap marker missing")
adr=(ROOT/"docs/adr/architecture-decisions.md").read_text(encoding="utf-8") if (ROOT/"docs/adr/architecture-decisions.md").exists() else ""
for n in range(1,18):
    aid=f"ADR-{n:03d}"
    if aid not in adr: errors.append(f"Missing accepted decision: {aid}")
if errors:
    print("CONTEXT VALIDATION FAILED")
    for e in errors: print("-",e)
    sys.exit(1)
print("Context validation passed.")
