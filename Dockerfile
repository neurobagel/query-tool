FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["nginx"]