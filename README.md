# ILApparel Warehouse Backend

## Introduction

This repository is to keep backend for Interloop Apparel warehouse backend application.

## TechStack

1. NestJs (Node.js backend framework)
2. Microsoft SQL Server (Database)
3. Node 14

### How to deploy?

1. Clone the repository.
2. Go to cloned folder.
3. Open terminal and run `npm install`.
4. Once all dependencies finished, copy file *ormconfig.template.json* to *ormconfig.json*.
5. Fill necessary information in json like database information and app port.
6. To start backend in dev mode, run: `npm run start:dev`.
7. To start backend in prod mode, run: `npm run start:prod`.
8. To build only, run: `npm run build`.
9. A build folder will be created and can be used with **pm2** to run as background service.

