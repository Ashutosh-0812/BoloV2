const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

console.log('Starting server...'); // Force restart

connectDB().then(() => {
  app.timeout = 300000; // 5 minutes timeout for large file processing
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
