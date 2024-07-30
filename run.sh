cd ./server/main

./gradlew build

docker build -t sewjo-server-app . 

docker run -p 8080:8080 \
    -e DATABASE_URL="jdbc:postgresql://dpg-cqb3c3g8fa8c73b04t40-a.oregon-postgres.render.com/sewjo_db" \
    -e DATABASE_USERNAME="sewjo_db_user" \
    -e DATABASE_PASSWORD="nPexHZ3W2biB0gmnqog33EDSaRTQLzzQ" \
    -e CLIENT_URL="http://localhost:3000" \
    sewjo-server-app