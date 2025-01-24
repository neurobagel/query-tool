#!/bin/sh

if [ -n "$PLAUSIBLE_DOMAIN" ] && [ -n "$PLAUSIBLE_SRC" ]; then
  add_script='<script async src="https://w.appzi.io/w.js?token=YVTHd"></script><script defer data-domain="'"$PLAUSIBLE_DOMAIN"'" src="'"$PLAUSIBLE_SRC"'"></script>'

  sed -i 's|<!-- Additional script tags -->|'"${add_script}"'|' /usr/share/nginx/html/index.html
fi

exec "$@"