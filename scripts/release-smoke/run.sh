#!/usr/bin/env bash
# Renders a ReactFire hook from a published npm version in a Vite app and a
# Next.js App Router app, each production-built, and fails on any page error,
# console error or failed request. See "Publishing a release" in
# .github/CONTRIBUTING.md.
#
# Usage: scripts/release-smoke/run.sh <reactfire version or dist-tag>
# Env:   FIREBASE (default 11.10.0), CHROME (path to a Chromium binary; if
#        unset, Playwright's own Chromium is installed and used)
set -u
V=${1:?usage: run.sh <reactfire version>}
FB=${FIREBASE:-11.10.0}
S=$(cd "$(dirname "$0")" && pwd)
RC=0

(cd "$S/runner" && npm i --no-save --silent --no-audit --no-fund playwright@1 >/dev/null 2>&1) || { echo "FAIL installing playwright"; exit 1; }
if [ -z "${CHROME:-}" ]; then (cd "$S/runner" && npx playwright install chromium >/dev/null 2>&1) || { echo "FAIL installing chromium"; exit 1; }; fi

for APP in vite-app next-app; do
  cd "$S/$APP"
  rm -rf node_modules package-lock.json dist .next
  DEPS="reactfire@$V firebase@$FB react@19 react-dom@19"
  if [ $APP = vite-app ]; then DEPS="$DEPS vite@7 @vitejs/plugin-react@5"; PORT=4173; else DEPS="$DEPS next@16"; PORT=4174; fi
  npm i --no-save --silent --no-audit --no-fund $DEPS >/dev/null 2>&1 || { echo "FAIL $APP install"; RC=1; continue; }
  npm run -s build > build.log 2>&1 || { echo "FAIL $APP build ($S/$APP/build.log)"; tail -5 build.log; RC=1; continue; }
  npm run -s serve > serve.log 2>&1 &
  SP=$!
  for _ in $(seq 1 30); do curl -sf -o /dev/null "http://localhost:$PORT" && break; sleep 1; done
  node "$S/runner/check.mjs" "http://localhost:$PORT/" || RC=1
  pkill -P $SP 2>/dev/null; kill $SP 2>/dev/null; wait $SP 2>/dev/null
done

[ $RC = 0 ] && echo "PASS reactfire@$V" || echo "FAIL reactfire@$V"
exit $RC
