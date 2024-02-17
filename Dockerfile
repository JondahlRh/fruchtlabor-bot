FROM node:20

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY tsconfig.json .
COPY src src
RUN npm run build

ENV API_PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]