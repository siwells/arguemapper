# https://dev.to/karanpratapsingh/dockerize-your-react-app-4j2e
# https://dev.to/guha/dockerize-a-react-app-and-deploy-it-on-an-aws-ec2-instance-2knm
# https://mherman.org/blog/dockerizing-a-react-app/

FROM node:17-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]