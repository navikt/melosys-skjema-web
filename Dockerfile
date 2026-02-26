FROM gcr.io/distroless/nodejs22-debian12:nonroot
ENV NODE_ENV=production
COPY build /app
WORKDIR /app
EXPOSE 8080
CMD ["dist/index.js"]
