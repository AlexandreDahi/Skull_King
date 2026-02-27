FROM nginx:1.28.2-alpine3.23

COPY ./dist/frontend/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]