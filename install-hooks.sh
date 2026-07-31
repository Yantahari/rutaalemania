#!/usr/bin/env bash
# Instala el hook versionado (scripts/hooks/pre-commit — olfato de secretos
# por contenido, dia 143) en .git/hooks/. Necesario porque .git/hooks/ no
# viaja en un clon. Paso documentado en docs/SETUP-LOCAL.md del repo ops
# (seccion 5); verificable: el gate de sesion de ops
# (tests/test_hook_installed.py) avisa si falta o esta desactualizado.
set -euo pipefail
cd "$(dirname "$0")"
install -m 755 scripts/hooks/pre-commit .git/hooks/pre-commit
echo "Hook pre-commit (olfato de secretos) instalado en .git/hooks/pre-commit"
