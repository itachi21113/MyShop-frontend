# Stage 1: Use the official Nginx image from Docker Hub.
# 'alpine' is a very small, secure version of Linux.
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your static website files into the default folder Nginx uses to serve content.
COPY . /usr/share/nginx/html

# This line is documentation; it tells the user that the container uses port 80.
EXPOSE 80

# The default command to start the Nginx server when the container runs.
CMD ["nginx", "-g", "daemon off;"]