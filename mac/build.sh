#!/bin/bash
# Builds Stacky.app (native Mac window around the live site) and installs it in /Applications.
set -euo pipefail
cd "$(dirname "$0")"
OUT="build/Stacky.app"
rm -rf build && mkdir -p "$OUT/Contents/MacOS" "$OUT/Contents/Resources"
xcrun swiftc -O -swift-version 5 -target arm64-apple-macos13.0 main.swift -o "$OUT/Contents/MacOS/Stacky" -framework Cocoa -framework WebKit
# App icon from the 1024px Stacky icon
ICONSET=build/AppIcon.iconset; mkdir -p "$ICONSET"
for s in 16 32 128 256 512; do
  sips -z $s $s ../ui/icons/stacky-1024.png --out "$ICONSET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) ../ui/icons/stacky-1024.png --out "$ICONSET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$OUT/Contents/Resources/AppIcon.icns"
cp Info.plist "$OUT/Contents/Info.plist"
codesign --force --deep --sign - "$OUT"
if [ "${1:-}" = "--install" ]; then
  rm -rf /Applications/Stacky.app && cp -R "$OUT" /Applications/Stacky.app && echo "Installed /Applications/Stacky.app"
fi
