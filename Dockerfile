FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY pm2.json .

# Install app dependencies
RUN npm install
RUN npm run build

CMD [ "pm2-runtime", "start", "pm2.json" ]