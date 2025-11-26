const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

console.log('Starting server...'); // Force restart

connectDB().then(() => {
  // Set server timeout to 5 minutes for large file processing
  const PORT = process.env.PORT || 8080;
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
  });
  server.timeout = 300000; // 5 minutes
}).catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
