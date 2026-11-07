import http.server
import socketserver
import webbrowser
import os
import socket

DEFAULT_PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def find_available_port(start_port=3000):
    port = start_port
    while port < start_port + 100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                return port
        port += 1
    return start_port

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for local development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    port = find_available_port(DEFAULT_PORT)
    url = f"http://localhost:{port}"

    print("=" * 60)
    print("✨ HAPPY DIWALI INTERACTIVE GREETING CARD WEB APP ✨")
    print("=" * 60)
    print(f"🚀 Serving local app at: {url}")
    print(f"📂 Directory: {DIRECTORY}")
    print("💡 Press Ctrl+C to stop the server.")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✨ Happy Diwali! Server stopped gracefully.")
