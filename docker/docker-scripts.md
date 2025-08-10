# Docker Management Scripts (ecom-backend)

## Quick Start

```bash
# Start all services
docker-compose up -d

# View logs (all)
docker-compose logs -f

# Stop services
docker-compose down

# Restart API only
docker-compose restart api
```

## PostgreSQL

```bash
# Connect to PostgreSQL
docker exec -it ecom-postgres psql -U postgres -d ecom_backend

# Backup database
docker exec ecom-postgres pg_dump -U postgres ecom_backend > backup.sql

# Restore database
docker exec -i ecom-postgres psql -U postgres ecom_backend < backup.sql

# Logs
docker logs ecom-postgres
```

## Redis

```bash
# Redis CLI
docker exec -it ecom-redis redis-cli

# Monitor
docker exec -it ecom-redis redis-cli monitor

# Logs
docker logs ecom-redis
```

## RabbitMQ

```bash
# Management UI: http://localhost:15682
# User/Pass: rabbitmq / rabbitmq

# Logs
docker logs ecom-rabbitmq

# List queues
docker exec ecom-rabbitmq rabbitmqctl list_queues
```

## Elasticsearch & Kibana

```bash
# Elasticsearch health
curl http://localhost:9200/_cluster/health

# Kibana UI
open http://localhost:5601
```

## Health & Monitoring

```bash
# All services
docker-compose ps

# API logs
docker logs -f ecom-api-dev
```

## Cleanup

```bash
# Remove containers, networks, volumes
docker-compose down -v

# Remove unused images
docker image prune -a

# Full cleanup
docker system prune -a --volumes
```

## Service URLs

- API: http://localhost:3012
- Swagger: http://localhost:3012/docs
- PostgreSQL: localhost:5443
- Redis: localhost:6390
- RabbitMQ AMQP: localhost:5683
- RabbitMQ Management: http://localhost:15683
- PgAdmin: http://localhost:8081
- Elasticsearch: http://localhost:9201
- Kibana: http://localhost:5602
