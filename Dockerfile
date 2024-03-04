FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD [ "npm","run","dev" ]

