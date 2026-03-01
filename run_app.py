#!/usr/bin/env python3
"""Launch the NBA Trade Generator like a local app.

Starts a local HTTP server, opens your default browser automatically,
and keeps running until you press Ctrl+C.
"""

from __future__ import annotations

import contextlib
import http.server
import socket
import socketserver
import threading
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)


def find_free_port() -> int:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind((HOST, 0))
        return int(s.getsockname()[1])


def main() -> None:
    port = find_free_port()

    class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
        allow_reuse_address = True

    with ThreadedTCPServer((HOST, port), Handler) as httpd:
        url = f"http://{HOST}:{port}/index.html"
        print("NBA Trade Generator is running.")
        print(f"Open: {url}")
        print("Press Ctrl+C to stop.")

        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        server_thread.start()

        webbrowser.open(url)

        try:
            server_thread.join()
        except KeyboardInterrupt:
            print("\nShutting down...")
            httpd.shutdown()
            httpd.server_close()


if __name__ == "__main__":
    main()
