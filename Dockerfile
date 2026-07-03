FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma files
COPY prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
