#!/usr/bin/env bash
# 로컬 미리보기 서버 (지도 데이터를 fetch 하므로 file:// 로는 동작하지 않습니다)
cd "$(dirname "$0")"
exec python3 tools/devserver.py "${1:-8080}"
