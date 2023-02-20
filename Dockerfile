FROM node:18.14.1-alpine3.17 as build
WORKDIR /build
COPY . .
RUN ./scripts/build.js

FROM node:18.14.1-alpine3.17 as runtime
RUN apk add tree
WORKDIR /app
COPY --from=build /build/dist/ ./
EXPOSE 3000
ENTRYPOINT [ "./entrypoint.sh" ]
