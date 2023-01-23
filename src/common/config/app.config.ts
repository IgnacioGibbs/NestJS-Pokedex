// Application configuration file for environment variables and constants used in the application

export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  mongodbUrl: process.env.MONGODB_URL,
  port: process.env.PORT,
  queryLimitDefault: process.env.QUERY_LIMIT_DEFAULT,
  querySkipDefault: process.env.QUERY_SKIP_DEFAULT,
});
