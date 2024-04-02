FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN --mount=type=secret,id=SUPABASE_URL  echo "SUPABASE_URL=$(cat /run/secrets/SUPABASE_URL)" >> .env && \
     --mount=type=secret,id=SUPABASE_KEY echo "SUPABASE_KEY=$(cat /run/secrets/SUPABASE_KEY)" >> .env

RUN npm run build
CMD [ "npm", "run", "start" ]