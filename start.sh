#!/bin/bash

# ---------------- start docker-compose ----------------
docker-compose -f devops/docker-compose.yml -p crt-casdoor --env-file devops/.env.example up -d;