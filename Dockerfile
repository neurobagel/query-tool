FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 5173

ENTRYPOINT npm run build && npm run preview