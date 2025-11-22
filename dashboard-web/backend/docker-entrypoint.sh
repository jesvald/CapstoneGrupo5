#!/bin/sh
set -e

echo "🔄 Waiting for MySQL to be ready..."

# Wait for MySQL to be ready
until node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).then(() => {
  console.log('✅ MySQL is ready!');
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
" 2>/dev/null; do
  echo "⏳ MySQL is unavailable - sleeping"
  sleep 2
done

echo "🌱 Running seed data script..."
node scripts/seed_data.js

echo "🚀 Starting application..."
exec "$@"
