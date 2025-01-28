#!/bin/sh

# This script is used to replace environment variables in the JS files
# with the values provided in the environment variables. If no value is
# provided, the default value is used.
#
# To add a new environment variable, add a new sed command to replace
# the placeholder in the JS files with the value of the environment
# variable and define a default value

# Check that the required environment variables are set
if [ -z "$NB_API_QUERY_URL" ]; then
  echo "NB_API_QUERY_URL is not set. Exiting."
  exit 1
fi

# Find all .js and .html files and loop through them
for file in $(find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \)); do
  sed -i "s|REPLACE_ME_NB_API_QUERY_URL_REPLACE_ME|${NB_API_QUERY_URL}|g" "$file"
  sed -i "s|REPLACE_ME_NB_ENABLE_AUTH_REPLACE_ME|${NB_ENABLE_AUTH:-false}|g" "$file"
  sed -i "s|REPLACE_ME_NB_QUERY_CLIENT_ID_REPLACE_ME|${NB_QUERY_CLIENT_ID:-testclient1234}|g" "$file"
  sed -i "s|REPLACE_ME_NB_ENABLE_CHATBOT_REPLACE_ME|${NB_ENABLE_CHATBOT:-false}|g" "$file"
  sed -i "s|REPLACE_ME_NB_QUERY_APP_BASE_PATH_REPLACE_ME|${NB_QUERY_APP_BASE_PATH:-/}|g" "$file"
  sed -i "s|<!-- REPLACE_ME_NB_QUERY_HEADER_SCRIPT_REPLACE_ME -->|${NB_QUERY_HEADER_SCRIPT}|g" "$file"
done

exec "$@"