"""Run this FlyBrain checkout on localhost; never expose it to the network."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen
import argparse
import webbrowser

ROOT = Path(__file__).resolve().parent

def main():
    parser = argparse.ArgumentParser(description='Start the local Bollywood Fly project')
    parser.add_argument('--no-open', action='store_true')
    args = parser.parse_args()
    url = 'http://127.0.0.1:8765/'
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8765), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
    except OSError:
        try:
            with urlopen(url, timeout=2) as response:
                same_project = b'Bollywood Fly' in response.read(4096)
        except Exception:
            same_project = False
        if same_project:
            print('Your local fly is already running:', url)
            if not args.no_open:
                webbrowser.open(url+'?routine=bollywood')
            return
        raise SystemExit('Port 8765 is being used by another program. Close that program or ask for help; nothing was stopped.')
    print('Bollywood Fly is running locally:', url, flush=True)
    print('Leave this window open. Press Control-C to stop.', flush=True)
    if not args.no_open:
        webbrowser.open(url+'?routine=bollywood')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nLocal fly stopped.')
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
