FROM node:20

WORKDIR /app

COPY . .

RUN npm ci --production

EXPOSE 5173

ENTRYPOINT npm run build && npm run preview