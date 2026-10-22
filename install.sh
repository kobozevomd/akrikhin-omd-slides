#!/usr/bin/env bash
# Установка: зависимости проекта + скилл akrikhin-brand-deck для Codex и/или Claude.
#
#   ./install.sh                 # npm-пакеты, python-пакеты, скилл для Codex и Claude, проверка окружения
#   ./install.sh --codex         # скилл только для Codex   (~/.codex/skills или $CODEX_HOME/skills)
#   ./install.sh --claude        # скилл только для Claude  (~/.claude/skills)
#   ./install.sh --out ~/Decks   # куда класть готовые деки (по умолчанию output/ в корне проекта)
#   ./install.sh --skill-only    # только переустановить скилл (после git pull)
#
# Системные программы (LibreOffice, poppler, ffmpeg) скрипт не ставит — проверяет и подсказывает команду.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
CODEX=0; CLAUDE=0; OUT=""; SKILL_ONLY=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --codex) CODEX=1 ;;
    --claude) CLAUDE=1 ;;
    --out) OUT="$2"; shift ;;
    --skill-only) SKILL_ONLY=1 ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "неизвестный ключ: $1"; exit 2 ;;
  esac
  shift
done
[[ $CODEX -eq 0 && $CLAUDE -eq 0 ]] && { CODEX=1; CLAUDE=1; }

cd "$ROOT"
if [[ $SKILL_ONLY -eq 0 ]]; then
  echo "== npm-пакеты"
  if command -v npm >/dev/null; then npm ci --no-audit --no-fund || npm install --no-audit --no-fund
  else echo "npm не найден — поставьте node ≥ 18 и запустите ./install.sh снова"; fi
  echo "== python-пакеты"
  python3 -m pip install --user -q -r requirements.txt || echo "не удалось поставить python-пакеты — поставьте вручную: python3 -m pip install -r requirements.txt"
fi

# папка готовых дек
if [[ -n "$OUT" ]]; then
  printf '{ "outDir": "%s" }\n' "$OUT" > local.json
elif [[ ! -f local.json ]]; then
  printf '{ "outDir": "output" }\n' > local.json
fi

install_skill() {
  local dest="$1/skills/akrikhin-brand-deck"
  mkdir -p "$1/skills"
  rm -rf "$dest"
  cp -R "$ROOT/skills/akrikhin-brand-deck" "$dest"
  # подставляем путь к проекту в тексты скилла
  local f
  while IFS= read -r -d '' f; do
    python3 - "$f" "$ROOT" << 'PY'
import sys
p, root = sys.argv[1], sys.argv[2]
s = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(s.replace('{{AKRIKHIN_ROOT}}', root))
PY
  done < <(find "$dest" -type f \( -name '*.md' -o -name '*.yaml' \) -print0)
  echo "скилл → $dest"
}
echo "== скилл"
[[ $CODEX -eq 1 ]] && install_skill "${CODEX_HOME:-$HOME/.codex}"
[[ $CLAUDE -eq 1 ]] && install_skill "$HOME/.claude"

chmod +x tools/*.py tools/*.sh 2>/dev/null || true
echo "== проверка окружения"
python3 tools/doctor.py || true
cat << EOF

Готово. Дальше откройте Codex (или Claude Code) и скажите, например:
  «Собери мне эту презентацию в стиле Акрихин: <путь к файлу>»
Скилл akrikhin-brand-deck подхватится сам; правила проекта — в $ROOT/AGENTS.md.
EOF
