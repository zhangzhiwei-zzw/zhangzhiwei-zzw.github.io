"""Regression tests for GitHub push events without payload.commits."""

from datetime import datetime, timezone
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
import xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo

import generate_habits as habits
import check_site


NOW = datetime(2026, 10, 25, 10, tzinfo=timezone.utc)
ZONE = ZoneInfo("Asia/Shanghai")


def push(event_id="1", created="2026-10-24T18:30:00Z", user="owner"):
    return {"id": event_id, "type": "PushEvent", "actor": {"login": user},
            "created_at": created, "payload": {"head": "abc", "ref": "refs/heads/main"}}


class HabitsTests(unittest.TestCase):
    def test_new_payload_timezone_and_duplicate_events(self):
        event = push()
        hours, days = habits.summarize([event, event], "OWNER", NOW, ZONE)
        self.assertEqual(sum(hours), 1)
        self.assertEqual(hours[2], 1)  # Saturday UTC becomes Sunday 02:30 in Shanghai.
        self.assertEqual(days[6], 1)

    def test_ignore_old_future_other_users_and_non_push_events(self):
        events = [push("1", "2026-09-01T00:00:00Z"),
                  push("2", "2026-10-26T00:00:00Z"), push("3", user="other"),
                  {"id": "4", "type": "WatchEvent"}]
        self.assertEqual(habits.summarize(events, "owner", NOW, ZONE), ([0] * 24, [0] * 7))

    def test_empty_activity_is_valid_svg(self):
        svg = habits.render("owner", [0] * 24, [0] * 7, NOW, ZONE)
        root = ET.fromstring(svg)
        self.assertIn("No public pushes", svg)
        self.assertNotIn("nan", svg.lower())
        self.assertEqual(len(root.findall("{http://www.w3.org/2000/svg}rect")), 31)

    def test_paginate_and_stop_at_short_page(self):
        batches = [[push(str(i)) for i in range(100)], [push("last")]]
        with patch.object(habits, "urlopen", side_effect=[io.StringIO(json.dumps(b)) for b in batches]) as api:
            self.assertEqual(len(habits.fetch_events("owner")), 101)
        self.assertEqual(api.call_count, 2)
        self.assertIn("page=2", api.call_args_list[1].args[0].full_url)

    def test_api_failure_preserves_previous_card(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "habits.svg"
            output.write_text("previous valid card")
            with patch.object(habits, "fetch_events", side_effect=URLError("offline")):
                with self.assertRaises(URLError):
                    habits.generate("owner", output)
            self.assertEqual(output.read_text(), "previous valid card")

    def test_reject_error_response_instead_of_rendering_empty_card(self):
        with patch.object(habits, "urlopen", return_value=io.StringIO('{"message":"API error"}')):
            with self.assertRaises(ValueError):
                habits.fetch_events("owner")

    def test_site_check_rejects_metrics_error_card(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "github-metrics").mkdir()
            (root / "index.html").write_text('<img src="github-metrics/habits.svg">')
            card = root / "github-metrics/habits.svg"
            card.write_text('<svg xmlns="http://www.w3.org/2000/svg"><text class="field error">Unexpected error</text></svg>')
            with patch("sys.argv", ["check_site.py", directory]), patch("sys.stderr", new_callable=io.StringIO), patch("sys.stdout", new_callable=io.StringIO):
                self.assertEqual(check_site.main(), 1)
                card.write_text(habits.render("owner", [0] * 24, [0] * 7, NOW, ZONE))
                self.assertEqual(check_site.main(), 0)


if __name__ == "__main__":
    unittest.main()
