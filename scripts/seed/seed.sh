#!/bin/bash
docker compose up -d
docker exec -i postgres_db psql -U user -d spendly < scripts/seed/seed.sql