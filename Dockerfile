FROM node:latest-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN --mount=type=secret,id=MASTER_URL \
    --mount=type=secret,id=API_KEY \
    echo "SUPABASE_URL=$(cat /run/secrets/SUPABASE_URL)" >> .env && \
    echo "SUPABASE_KEY=$(cat /run/secrets/SUPABASE_KEY)" >> .env

RUN npm run build
CMD [ "npm", "run", "start" ]