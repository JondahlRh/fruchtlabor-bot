FROM node:20

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
RUN npm ci

COPY src src
RUN npm run build

ENV API_PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]