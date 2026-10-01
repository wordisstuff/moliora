#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/plugins/moliora-ads-analytics-local"
DST="$HOME/.codex/plugins/moliora-ads-analytics-local"
MARKET_DIR="$HOME/.agents/plugins"
MARKET_FILE="$MARKET_DIR/marketplace.json"
MARKET_PLUGIN_PATH="./.codex/plugins/moliora-ads-analytics-local"

mkdir -p "$HOME/.codex/plugins" "$MARKET_DIR"
rm -rf "$DST"
cp -R "$SRC" "$DST"

python3 - "$MARKET_FILE" "$MARKET_PLUGIN_PATH" <<'PY'
import json, os, sys
market_file, plugin_path = sys.argv[1], sys.argv[2]
data = {"name":"moliora-local","interface":{"displayName":"Moliora Local"},"plugins":[]}
if os.path.exists(market_file):
    try:
        with open(market_file, "r", encoding="utf-8") as f:
            existing = json.load(f)
        if isinstance(existing, dict):
            data = existing
    except Exception:
        pass
data.setdefault("name","moliora-local")
data.setdefault("interface",{"displayName":"Moliora Local"})
plugins = data.setdefault("plugins",[])
plugins = [p for p in plugins if p.get("name") != "moliora-ads-analytics-local"]
plugins.append({
    "name":"moliora-ads-analytics-local",
    "source":{"source":"local","path":plugin_path},
    "policy":{"installation":"AVAILABLE","authentication":"ON_INSTALL"},
    "category":"Productivity"
})
data["plugins"] = plugins
with open(market_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
print("Installed local plugin at:", os.path.expanduser("~/.codex/plugins/moliora-ads-analytics-local"))
print("Marketplace:", market_file)
print("Marketplace source.path:", plugin_path)
PY

echo
echo "Done."
echo "1) Quit ChatGPT Desktop completely."
echo "2) Open ChatGPT Desktop again."
echo "3) Local marketplaces are surfaced in supported Work/Codex views in ChatGPT Desktop."
echo "4) Open Plugins there, choose 'Moliora Local', and install 'Moliora Ads & Analytics (Local)'."
