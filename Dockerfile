FROM gcr.io/distroless/nodejs22-debian12:nonroot
COPY server/dist /app/dist
COPY server/public /app/public
WORKDIR /app
EXPOSE 8080
CMD ["dist/index.js"]
