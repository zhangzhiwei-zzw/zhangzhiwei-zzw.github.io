"""Generate the coding habits card from public GitHub push event timestamps."""

import argparse
from datetime import datetime, timedelta, timezone
from html import escape
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


def fetch_events(user, token=None):
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "personal-site-habits",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    events = []
    # GitHub exposes at most 300 events from the last 30 days.
    for page in range(1, 4):
        request = Request(
            f"https://api.github.com/users/{user}/events/public?per_page=100&page={page}",
            headers=headers,
        )
        with urlopen(request, timeout=30) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise ValueError("GitHub returned an invalid event list")
        events.extend(batch)
        if len(batch) < 100:
            break
    return events


def summarize(events, user, now, zone):
    hours, weekdays = [0] * 24, [0] * 7
    cutoff = now - timedelta(days=30)
    seen = set()
    for event in events:
        if event.get("type") != "PushEvent":
            continue
        if event.get("actor", {}).get("login", "").casefold() != user.casefold():
            continue
        event_id = str(event["id"])
        if event_id in seen:
            continue
        seen.add(event_id)
        created = datetime.fromisoformat(event["created_at"].replace("Z", "+00:00"))
        if not cutoff <= created <= now:
            continue
        local = created.astimezone(zone)
        hours[local.hour] += 1
        weekdays[local.weekday()] += 1
    return hours, weekdays


def bars(values, labels, baseline, height):
    maximum = max(values) or 1
    step = 440 / len(values)
    width = step * 0.65
    svg = []
    for index, (value, label) in enumerate(zip(values, labels)):
        x = 40 + step * (index + 0.5)
        bar_height = value / maximum * height
        svg.append(
            f'<rect class="bar" x="{x - width / 2:.2f}" '
            f'y="{baseline - bar_height:.2f}" width="{width:.2f}" '
            f'height="{bar_height:.2f}" rx="2">'
            f'<title>{escape(label)}: {value} pushes</title></rect>'
        )
        # Keep hour labels readable on narrow screens.
        if len(values) == 7 or index % 3 == 0:
            svg.append(
                f'<text class="tick" text-anchor="middle" x="{x:.2f}" '
                f'y="{baseline + 17}">{escape(label)}</text>'
            )
    return "\n".join(svg)


def render(user, hours, weekdays, now, zone):
    total = sum(hours)
    updated = now.astimezone(zone).strftime("%Y-%m-%d")
    summary = f"{total} public pushes in the last 30 days"
    if not total:
        summary = "No public pushes in the last 30 days"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="520" height="390" viewBox="0 0 520 390" role="img" aria-labelledby="title description">
<title id="title">Recent coding habits</title>
<desc id="description">{escape(user)}: {summary}. Hours and weekdays in {escape(zone.key)}. Based on up to 300 recent public events.</desc>
<style>
text {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #24292f; }}
.heading {{ font-size: 20px; font-weight: 600; }}
.label {{ font-size: 13px; }}
.tick, .note {{ font-size: 11px; fill: #57606a; }}
.bar {{ fill: #40a865; }}
.axis {{ stroke: #d0d7de; }}
@media (prefers-color-scheme: dark) {{
  text {{ fill: #e6edf3; }}
  .tick, .note {{ fill: #a8b3bf; }}
  .axis {{ stroke: #484f58; }}
  .bar {{ fill: #40c463; }}
}}
</style>
<text class="heading" x="24" y="30">Recent coding habits</text>
<text class="note" x="24" y="52">@{escape(user)} · Public push activity</text>
<text class="label" x="24" y="78">{summary}</text>
<text class="label" x="24" y="108">By hour · {escape(zone.key)}</text>
<path class="axis" d="M40 190H480"/>
{bars(hours, [f"{hour:02d}" for hour in range(24)], 190, 66)}
<text class="label" x="24" y="240">By weekday</text>
<path class="axis" d="M40 320H480"/>
{bars(weekdays, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 320, 64)}
<text class="note" x="24" y="362">Sample: up to 300 recent public GitHub events</text>
<text class="note" x="24" y="380">Updated {updated} · Push events, not commit counts</text>
</svg>
'''


def generate(user, output, zone_name="Asia/Shanghai", token=None):
    if not re.fullmatch(r"[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})", user):
        raise ValueError("Invalid GitHub username")
    zone = ZoneInfo(zone_name)
    events = fetch_events(user, token)
    now = datetime.now(timezone.utc)
    hours, weekdays = summarize(events, user, now, zone)
    svg = render(user, hours, weekdays, now, zone)
    # Do not replace the last good card if fetching or rendering fails.
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent,
                                         suffix=".svg", delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(svg)
        temporary.replace(output)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return sum(hours)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        total = generate(args.user, args.output, token=os.environ.get("GITHUB_TOKEN"))
    except (HTTPError, URLError, ValueError, KeyError, TypeError, OSError) as error:
        parser.exit(1, f"Could not generate coding habits; previous card kept: {error}\n")
    print(f"Generated {args.output}: {total} public push events in the last 30 days")


if __name__ == "__main__":
    main()
