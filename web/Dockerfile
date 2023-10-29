FROM node:18

WORKDIR /app
RUN ls -l
COPY package.json package-lock.json ./
RUN npm i

COPY src ./src
RUN ls -l
RUN echo "hello world"
CMD npm start
