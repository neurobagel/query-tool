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

EXPOSE 80

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]