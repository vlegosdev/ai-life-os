$ErrorActionPreference = "Stop"
git init
git branch -M main
python scripts/validate_project_context.py
git add .
git commit -m "chore: initialize AI Life OS repository v1.0"
Write-Host "Repository initialized. Add a GitHub remote or publish with GitHub Desktop."
