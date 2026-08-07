#!/usr/bin/env bash
# Run AFTER the AI Fund article is live on Substack.
#   ./scripts/publish-aifund-article.sh "https://thewhyman.blog/p/..."
set -euo pipefail
URL="${1:?usage: publish-aifund-article.sh <substack-url>}"
cd "$(dirname "$0")/.."
python3 - "$URL" <<'PY'
import json,sys
url=sys.argv[1]
P="data/canonical.json"; d=json.load(open(P))
fc=d["writingLibrary"].get("forthcoming",[])
moved=[a for a in fc if "AI Fund" in a["title"]]
if not moved: print("nothing to publish"); raise SystemExit
a=moved[0]; a.pop("status",None); a.pop("handling",None); a["url"]=url
a["venue"]="Substack"
d["writingLibrary"]["articles"].append(a)
d["writingLibrary"]["forthcoming"]=[x for x in fc if x is not a]
d["aiFundLessons"]["_note"]=d["aiFundLessons"]["_note"].replace(
  "The write-up is forthcoming; do NOT describe it as published or offer a link to it.",
  f"Published write-up: {url}")
json.dump(d,open(P,'w'),indent=2)
print("published ->",url)
PY
node scripts/build-cloudflare-function.js
npm run build >/dev/null 2>&1 && echo "built. commit + push to deploy."
