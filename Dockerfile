# prod dependency stage
FROM node:20 AS prod-dependency-stage

RUN npm install -g pnpm

ENV NODE_ENV=production
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
RUN pnpm install


# build stage
FROM node:20 AS build-stage

RUN npm install -g pnpm

ENV NODE_ENV=development
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
RUN pnpm install

COPY src src
RUN pnpm run build


# prod stage
FROM node:20 AS prod-stage

ENV NODE_ENV=production
WORKDIR /app

COPY package.json .
COPY --from=prod-dependency-stage /app/node_modules node_modules
COPY --from=build-stage /app/build build

CMD ["node", "build"]
