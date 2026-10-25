# Keep Metrics' original renderer and dependencies; patch only the Habits plugin.
FROM ghcr.io/lowlighter/metrics:v3.34
COPY .github/metrics/patch-habits.mjs .github/metrics/test-habits.mjs /tmp/metrics-habits/
RUN node /tmp/metrics-habits/test-habits.mjs \
    && node /tmp/metrics-habits/patch-habits.mjs /metrics/source/plugins/habits/index.mjs
