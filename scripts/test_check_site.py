"""Reject Metrics error cards even when their generating action succeeded."""

import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import check_site


class SiteCheckTests(unittest.TestCase):
    def test_reject_error_card_and_accept_valid_svg(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "github-metrics").mkdir()
            (root / "index.html").write_text('<img src="github-metrics/habits.svg">')
            card = root / "github-metrics/habits.svg"
            card.write_text('<svg xmlns="http://www.w3.org/2000/svg"><text class="field error">Unexpected error</text></svg>')
            with patch("sys.argv", ["check_site.py", directory]), patch("sys.stderr", new_callable=io.StringIO), patch("sys.stdout", new_callable=io.StringIO):
                self.assertEqual(check_site.main(), 1)
                card.write_text('<svg xmlns="http://www.w3.org/2000/svg"><text>Recent coding habits</text></svg>')
                self.assertEqual(check_site.main(), 0)


if __name__ == "__main__":
    unittest.main()
