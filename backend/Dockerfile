FROM php:8.2.0-fpm-buster
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN apt update
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git zip unzip
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN docker-php-ext-install pdo_mysql
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony
WORKDIR /backend
COPY ./backend/composer.json .
RUN composer install --no-interaction --no-progress
CMD ["symfony", "server:start"]

#RUN IN CONTAINER (Everytime you run "docker compose up --build -d", if you don't include flag "--build", you don't need to run this command)
#chmod -R 777 ./var
#chmod -R 777 ./var/.
#Also use it if you get problems with executing scripts in container especially: cache:clear problems

#RUN when you need to info IDE about dependencies (copy all from vendor folder on container to host vendor folder)
# => docker cp <containerName>:/file/path/within/container /host/path/target (absolute paths)
# fe: docker cp app-backend-foodly:/backend/vendor/. ~/Software/Development/Foodly/backend/vendor/.

