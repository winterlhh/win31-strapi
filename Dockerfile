FROM node:20-bookworm-slim AS build
RUN apt-get update && apt-get install -y build-essential python3 libvips-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y libvips42 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 8080
CMD ["npm", "run", "start"]
