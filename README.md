# Quizformacao-back 

# How to run

Create a container to database

```shell
docker run --name quizformacao_db -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_USER=qf -e MYSQL_PASSWORD=qf123 -e MYSQL_DATABASE=quizformacao -p 3306:3306 -d mysql
```

Start the server:   

```shell
yarn run dev 
```