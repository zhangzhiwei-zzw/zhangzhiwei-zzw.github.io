"""Check local image, script and stylesheet references in the built site."""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class AssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"img", "script", "source"} and attrs.get("src"):
            self.assets.append(attrs["src"])
        if tag == "link" and attrs.get("href"):
            if set(attrs.get("rel", "").split()) & {"stylesheet", "icon"}:
                self.assets.append(attrs["href"])


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "site").resolve()
    pages = list(root.rglob("*.html"))
    if not pages:
        print(f"No built HTML pages found in {root}", file=sys.stderr)
        return 1

    missing = []
    for page in pages:
        parser = AssetParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for asset in parser.assets:
            url = urlsplit(asset)
            if url.scheme or url.netloc or not url.path:
                continue
            path = unquote(url.path)
            target = root / path.lstrip("/") if path.startswith("/") else page.parent / path
            if not target.is_file():
                missing.append(f"{page.relative_to(root)}: {asset}")

    for entry in missing:
        print(f"Missing asset: {entry}", file=sys.stderr)
    print(f"Checked {len(pages)} HTML pages; {len(missing)} missing local assets.")
    return int(bool(missing))


if __name__ == "__main__":
    sys.exit(main())
