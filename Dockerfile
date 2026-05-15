# Base
FROM node:lts-alpine as base

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Build App
FROM base AS build

ARG VITE_APP_ENV
ARG VITE_APP_MODE_MOCK
ARG VITE_APP_PORT

ARG VITE_API_BASE_URL
ARG VITE_API_AUTH_URL

ARG VITE_APP_LIMIT_PAGE
ARG VITE_API_TIMEOUT

ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_APP_MODE_MOCK=${VITE_APP_MODE_MOCK}
ENV VITE_APP_PORT=${VITE_APP_PORT}

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_AUTH_URL=${VITE_API_AUTH_URL}

ENV VITE_APP_LIMIT_PAGE=${VITE_APP_LIMIT_PAGE}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Serve App
FROM base

RUN npm install -g serve

COPY --from=build /app/dist ./dist
COPY --from=build /app/build.sh ./build.sh

CMD ["sh", "build.sh"]
