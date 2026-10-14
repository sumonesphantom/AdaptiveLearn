#!/usr/bin/env bash
# Starts the full POC: local LLM (Ollama), ML service (BKT), and the web app.
# Usage: ./start-demo.sh        then open http://localhost:3000/?ref=skool
set -euo pipefail
cd "$(dirname "$0")"

MODEL="${OLLAMA_MODEL:-qwen2.5:7b-instruct}"

if ! curl -sf http://127.0.0.1:11434/api/version >/dev/null; then
  echo "Starting Ollama..."
  ollama serve >/tmp/adaptivelearn-ollama.log 2>&1 &
  sleep 3
fi
ollama list | grep -q "^${MODEL}" || ollama pull "$MODEL"
# Warm the model so the first tutor answer is fast.
curl -s http://127.0.0.1:11434/api/generate -d "{\"model\":\"$MODEL\",\"prompt\":\"hi\",\"stream\":false,\"options\":{\"num_predict\":1}}" >/dev/null &

echo "Starting ML service on :8000..."
(cd ml && { [ -f model/bkt_params.json ] || uv run python train.py; } && uv run uvicorn server:app --port 8000) &
ML_PID=$!

echo "Starting web app on :3000..."
(cd web && { [ -d node_modules ] || pnpm install; } && OLLAMA_MODEL="$MODEL" pnpm dev --port 3000) &
WEB_PID=$!

trap 'kill $ML_PID $WEB_PID 2>/dev/null' EXIT INT TERM
wait
