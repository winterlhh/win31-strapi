FROM node:20-bookworm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENV NODE_ENV=production
RUN npm run build

ENV HOST=0.0.0.0
CMD ["sh", "-c", "echo \"Starting Strapi: PORT=$PORT HOST=$HOST NODE_ENV=$NODE_ENV DB=$DATABASE_CLIENT\" && npm run start"]
