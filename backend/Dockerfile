FROM node:19-buster-slim

LABEL maintainer="Abdullah"
LABEL version="1.0"
LABEL description="This is the backend server for the Weather Station app"
LABEL environment="development"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# General App Settings
ENV NODE_ENV=development
ENV SECRET=secret
ENV PORT=3000

# INFLUXDB General Config
ENV INFLUXDB_USERNAME=root
ENV INFLUXDB_PASS=root
ENV INFLUXDB_HOST=localhost

# INFLUXDB Development Config
ENV INFLUX_DATABASE_DEV=weather_dev
ENV INFLUX_MEASUREMENT_DEV=weather_data
ENV TOPIC_DEV=Weather_Data

EXPOSE 3000
EXPOSE 3306
EXPOSE 8086
CMD [ "npm", "run", "dev" ]