FROM gcr.io/distroless/nodejs22-debian12:nonroot
COPY server/dist /app/dist
COPY server/public /app/public
COPY server/node_modules /app/node_modules
WORKDIR /app
EXPOSE 8080
CMD ["dist/index.js"]
