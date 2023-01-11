# FoodlyDocker

docker compose up --build -d (pełna konfiguracja z symfony + mysql + next.js)

w kontenerze "app-backend-foodly":
chmod -R 777 ./public && chmod -R 777 ./vendor && chmod -R 777 ./var
php bin/console doctrine:migrations:migrate

Następnie wejść pod adres /seeder żeby zaseedować bazę danych danymi

