FROM node:20-alpine AS build

WORKDIR /app

COPY . .

ENV NB_API_QUERY_URL="REPLACE_ME_NB_API_QUERY_URL_REPLACE_ME"
ENV NB_ENABLE_AUTH="REPLACE_ME_NB_ENABLE_AUTH_REPLACE_ME"
ENV NB_QUERY_CLIENT_ID="REPLACE_ME_NB_QUERY_CLIENT_ID_REPLACE_ME"
ENV NB_ENABLE_CHATBOT="REPLACE_ME_NB_ENABLE_CHATBOT_REPLACE_ME"
ENV NB_QUERY_APP_BASE_PATH="REPLACE_ME_NB_QUERY_APP_BASE_PATH_REPLACE_ME"

RUN npm ci

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html

# Now we will define a custom port for the webserver (NGINX)
# to listen on INSIDE of the container. The default port would
# be port 80.
ENV NGINX_PORT=5173
RUN sed -i "s/listen[[:space:]]*80/listen ${NGINX_PORT}/g" /etc/nginx/conf.d/default.conf
EXPOSE ${NGINX_PORT}


ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]