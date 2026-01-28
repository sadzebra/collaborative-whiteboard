FROM node:24-alpine as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install

COPY server/ ./

COPY --from=client-build /app/client/dist ./public 

EXPOSE 3001 

CMD ["node", "index.js"]
