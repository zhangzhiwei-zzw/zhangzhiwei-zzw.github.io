# Keep Metrics' original renderer and dependencies; patch API compatibility only.
FROM ghcr.io/lowlighter/metrics:v3.34
COPY .github/metrics/*.mjs /tmp/metrics-compatibility/
RUN node /tmp/metrics-compatibility/test-habits.mjs \
    && node /tmp/metrics-compatibility/test-plugins.mjs \
    && node /tmp/metrics-compatibility/patch-plugins.mjs /metrics
