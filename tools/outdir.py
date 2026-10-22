#!/usr/bin/env python3
"""Печатает абсолютный путь к папке готовых дек (local.json → outDir, по умолчанию output/).

    OUT=$(python3 tools/outdir.py)
"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lp = os.path.join(ROOT, 'local.json')
d = json.load(open(lp)).get('outDir', 'output') if os.path.exists(lp) else 'output'
p = os.path.abspath(os.path.join(ROOT, d))
os.makedirs(p, exist_ok=True)
print(p)
