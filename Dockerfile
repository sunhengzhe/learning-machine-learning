FROM node:10.15.0-alpine
MAINTAINER sunhengzhe@foxmail.com
COPY . /app/
WORKDIR /app
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime", "pm2.json"]