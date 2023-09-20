FROM node:18

# Create app directory
WORKDIR /usr/src/app
ENV MONGO_DB_URL=mongodb+srv://litheshp:mangatholi8088@cluster0.wpklau1.mongodb.net/CarParkingApp?retryWrites=true&w=majority
ENV PORT=5000
ENV FB_APP_ID=1596834660353093
ENV FB_APP_SECRET=4b71770e41d13753565ffe715bcc7738
ENV GOOGLE_APP_ID=1596834660353093
ENV GOOGLE_APP_SECRET=4b71770e41d13753565ffe715bcc7738
ENV db_hostname=localhost
ENV db_username=postgres
ENV db_password=postgres
ENV database_port=5432
ENV servicename=postgres
ENV JWT_SECRET_KEY = car_parking_booking_secret
ENV TOKEN_HEADER_KEY = gfg_token_header_key
# Install app dependencies
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .
EXPOSE 5000
CMD [ "node", "src/app.js" ]
