#!/usr/bin/env bash
# Рендер .pptx в PNG для проверки: tools/render.sh out/deck.pptx  → out/render/<deck>/slide-N.png
# У каждого запуска свой профиль LibreOffice — можно рендерить несколько дек параллельно.
# SOFFICE=/путь/к/soffice — если LibreOffice не в PATH (macOS: /Applications/LibreOffice.app/Contents/MacOS/soffice).
# RENDER_LOCALE=en-US tools/render.sh … — рендер с английской локалью (точка в числах графиков, как у англоязычного клиента).
set -e
shopt -s nullglob
DECK="$1"
NAME="$(basename "$DECK" .pptx)"
DIR="$(cd "$(dirname "$DECK")" && pwd)"
OUT="$DIR/render/$NAME"
PROFILE="$(mktemp -d /tmp/lo_profile_XXXXXX)"
if [[ -n "$RENDER_LOCALE" ]]; then
  mkdir -p "$PROFILE/user"
  cat > "$PROFILE/user/registrymodifications.xcu" << XCU
<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<item oor:path="/org.openoffice.Setup/L10N"><prop oor:name="ooSetupSystemLocale" oor:op="fuse"><value>$RENDER_LOCALE</value></prop></item>
<item oor:path="/org.openoffice.Setup/L10N"><prop oor:name="ooLocale" oor:op="fuse"><value>$RENDER_LOCALE</value></prop></item>
</oor:items>
XCU
fi
mkdir -p "$OUT"
rm -f "$OUT"/slide-*.png "$OUT/$NAME.pdf"
"${SOFFICE:-soffice}" -env:UserInstallation=file://$PROFILE --headless --convert-to pdf --outdir "$OUT" "$DECK" >/dev/null 2>&1
rm -rf "$PROFILE"
pdftoppm -png -r 96 "$OUT/$NAME.pdf" "$OUT/slide"
ls -1 "$OUT"/slide-*.png
