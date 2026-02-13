FROM gcr.io/distroless/nodejs22-debian12:nonroot
COPY build /app
WORKDIR /app
EXPOSE 8080
CMD ["dist/index.js"]
