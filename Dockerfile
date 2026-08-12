FROM node:20-slim

WORKDIR /app

# Install frontend deps and build
COPY frontend/package.json frontend/package-lock.json /app/frontend/
RUN cd frontend && npm install

COPY frontend/ /app/frontend/
RUN cd frontend && npm run build

# Install backend deps
COPY backend/package.json backend/package-lock.json /app/backend/
RUN cd backend && npm install

COPY backend/ /app/backend/

# HF Spaces default port
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

WORKDIR /app/backend
CMD ["node", "server.js"]
