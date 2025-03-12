source "$(dirname "$0")/.env"
echo "Running Medusa migrations"
docker exec -it \
  -e DATABASE_URL="postgres://$POSTGRES_ADMIN_USER:$POSTGRES_ADMIN_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB?schema=medusa" \
  medusa yarn medusa migrations run
