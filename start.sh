#!/bin/sh
echo "=== Strapi Startup ==="
echo "PORT=$PORT"
echo "HOST=$HOST"
echo "NODE_ENV=$NODE_ENV"
echo "DATABASE_CLIENT=$DATABASE_CLIENT"
echo "DATABASE_HOST=$DATABASE_HOST"
echo "DATABASE_PORT=$DATABASE_PORT"
echo "DATABASE_NAME=$DATABASE_NAME"
echo "===================="

node -e "
const { Client } = require('pg');
const c = new Client({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});
c.connect()
  .then(() => { console.log('DB connection OK'); c.end(); })
  .catch(e => { console.error('DB connection FAILED:', e.message); })
  .then(() => {
    console.log('Starting strapi...');
    require('child_process').execFileSync('npm', ['run', 'start'], { stdio: 'inherit' });
  });
"
