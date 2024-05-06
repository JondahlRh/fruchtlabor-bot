# dependency stage
FROM node:20-alpine AS dependency-stage

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json .
RUN npm ci


# build stage
FROM dependency-stage AS build-stage

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependency-stage /app/node_modules node_modules

COPY package*.json .

COPY tsconfig.json .
COPY src src
RUN npm run build


# production stage
FROM dependency-stage AS prod-stage

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build-stage /app/build build

ENV INTERNAL_PORT=3000
EXPOSE 3000

CMD ["node", "build"]