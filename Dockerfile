# build dependency stage
FROM node:20-alpine AS build-dependency-stage
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json .
RUN npm ci


# prod dependency stage
FROM node:20-alpine AS prod-dependency-stage
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json .
RUN npm ci


# build stage
FROM node:20-alpine AS build-stage
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build-dependency-stage /app/node_modules node_modules

COPY package*.json .

COPY tsconfig.json .
COPY src src
RUN npm run build


# prod stage
FROM node:20-alpine AS prod-stage
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-dependency-stage /app/node_modules node_modules
COPY --from=build-stage /app/build build

ENV INTERNAL_PORT=3000
EXPOSE 3000

CMD ["node", "build"]