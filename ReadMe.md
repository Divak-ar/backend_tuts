# 📰 Simple News DB and API

## Overview

This project is a backend service designed for managing a news database and providing an API interface for interacting with it.
The backend is built using **Node.js** with **Express.js** for server-side logic, **VineJS** for validation, **Redis** for caching,
**Prisma** as the ORM, **PostgreSQL** as the database, **Nodemailer** for email services, and **BullMQ** for managing background jobs.

## 🛠️ Technologies Used

### Express.js

**Express.js** is a fast, unopinionated, and minimalist web framework for Node.js. It is used to build the RESTful API that powers this
news service.

### VineJS

**VineJS** is a powerful and flexible validation library for Node.js. It ensures that incoming requests meet specific requirements before
they are processed.

### Redis

**Redis** is an in-memory data structure store, used as a database, cache, and message broker. It improves the performance of this project
by caching frequently accessed data.

Use Docker to pull redis image or if downloaded locally then use that:
For Dockers : run this command in project directory
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass mypassword" redis/redis-stack:latest
And then run : (here 1001 and 13333 are port mapping for Redis Stack server and RedisInsight and redis/redis-stack:latest is the image name)
docker run -p 10001:6379 -p 13333:8001 redis/redis-stack:latest

### Prisma

**Prisma** is a modern ORM (Object-Relational Mapping) tool that simplifies database access. It interacts with the PostgreSQL database,
providing a type-safe API for querying and managing data.

### PostgreSQL

**PostgreSQL** is a powerful, open-source relational database system. It stores news articles, user information, and other related data.

### Nodemailer

**Nodemailer** is a module for Node.js that allows for easy email sending. It handles notifications such as email verifications
and password resets.

### BullMQ

**BullMQ** is a powerful library for managing background jobs in Node.js. Built on top of Redis, it handles tasks like sending emails
and processing data asynchronously.

## 🚀 Getting Started
