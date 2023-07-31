#!/bin/bash

# ---------------- start docker-compose ----------------
docker-compose -f devops/docker-compose-dev.yml -p crt-casdoor-example --env-file devops/.env.example up -d;