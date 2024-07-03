FROM node:18-alpine
RUN mkdir -p /sewjo-ocr
WORKDIR /sewjo-ocr
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start"]