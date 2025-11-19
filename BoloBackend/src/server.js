const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
