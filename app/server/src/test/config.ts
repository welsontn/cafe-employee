const config = {
  Memory: false, // alpine not supported
  IP: process.env.MONGO_HOST,
  Port: process.env.MONGO_PORT,//'27017',
  User: process.env.MONGO_USER,
  Password: process.env.MONGO_PASS,
  Database: process.env.MONGO_TEST_DB_NAME,
}
export = config;