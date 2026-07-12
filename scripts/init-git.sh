#!/usr/bin/env bash
set -euo pipefail
git init
git branch -M main
python scripts/validate_project_context.py
git add .
git commit -m "chore: initialize AI Life OS repository v1.0"
echo "Repository initialized. Add a GitHub remote or publish with GitHub Desktop."
