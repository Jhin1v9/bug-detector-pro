#!/usr/bin/env python3
"""
Servidor HTTP simples para hospedar o bug-detector.iife.js localmente.
Útil para testar o bookmarklet/userscript na rede local (ex: celular na mesma WiFi).

Uso:
    python serve-bugdetector.py

Acesse:
    http://SEU_IP_LOCAL:8765/bug-detector.iife.js
"""

import http.server
import socketserver
import os

PORT = 8765
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    print(f"🐛 Servindo BugDetector em http://localhost:{PORT}/")
    print(f"   Arquivo IIFE: http://localhost:{PORT}/packages/bug-detector/dist/bug-detector.iife.js")
    print("   Pressione Ctrl+C para parar.\n")
    with socketserver.TCPServer(("", PORT), CORSHandler) as httpd:
        httpd.serve_forever()
