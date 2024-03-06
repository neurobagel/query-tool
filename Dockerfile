FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5173

ENTRYPOINT npm run preview