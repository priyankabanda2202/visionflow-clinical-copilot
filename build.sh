#!/usr/bin/env bash
set -o errexit

echo "=== VisionFlow build: Python deps ==="
pip install -r requirements.txt

echo "=== VisionFlow build: Next.js frontend ==="
cd web
npm install
npm run build
cd ..

if [ ! -f web/out/index.html ]; then
  echo "ERROR: Next.js export failed — web/out/index.html not found"
  exit 1
fi

echo "=== VisionFlow build: OK ==="
