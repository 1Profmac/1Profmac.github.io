#!/usr/bin/env python3
"""Print facilitator HTML sheets to letter PDFs with Chrome (same as File → Print → Save as PDF)."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
PDF_DIR = HERE / "pdf"
PORT = 8765
BASE = f"http://127.0.0.1:{PORT}"

SHEETS = [
    "week-01-talk-to-ai.html",
    "week-01-take-home.html",
    "week-01-talk-to-ai-research.html",
    "SCRIPT-lesson-02-talk-to-ai.html",
    "00-module-spine.html",
    "00-session-script.html",
    "week-02-scams.html",
    "week-03-connected.html",
    "week-04-health.html",
    "week-05-fork.html",
    "week-06-capstone.html",
    "pre-post-survey.html",
    "outcomes-report.html",
    "pilot-offer.html",
]


def chrome_bin() -> str:
    for name in ("google-chrome", "google-chrome-stable", "chromium-browser", "chromium"):
        path = subprocess.getoutput(f"command -v {name}").strip()
        if path:
            return path
    sys.exit("Chrome/Chromium not found")


def print_one(chrome: str, html_name: str) -> Path:
    pdf_path = PDF_DIR / (Path(html_name).stem + ".pdf")
    if pdf_path.exists():
        pdf_path.unlink()
    tmp = tempfile.mkdtemp(prefix="chrome-pdf-")
    cmd = [
        chrome,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--no-pdf-header-footer",
        "--virtual-time-budget=5000",
        f"--user-data-dir={tmp}",
        f"--print-to-pdf={pdf_path}",
        f"{BASE}/{html_name}",
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    deadline = 25
    waited = 0.0
    last_size = -1
    stable = 0
    try:
        while waited < deadline:
            if pdf_path.exists():
                size = pdf_path.stat().st_size
                if size > 1000 and size == last_size:
                    stable += 1
                    if stable >= 2:
                        break
                else:
                    stable = 0
                last_size = size
            time.sleep(0.4)
            waited += 0.4
            if proc.poll() is not None:
                break
        if proc.poll() is None:
            proc.kill()
            proc.wait(timeout=5)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    if not pdf_path.exists() or pdf_path.stat().st_size < 1000:
        sys.exit(f"PDF missing or too small: {pdf_path}")
    return pdf_path


def main() -> None:
    PDF_DIR.mkdir(exist_ok=True)
    chrome = chrome_bin()
    names = sys.argv[1:] or SHEETS
    for name in names:
        path = print_one(chrome, name)
        kb = path.stat().st_size // 1024
        print(f"wrote {path.name} ({kb} KB)")


if __name__ == "__main__":
    main()
