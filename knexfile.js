
import Knex from 'knex';
import { dbConfig } from './config/index.js'
import { knexSnakeCaseMappers } from 'objection';

const knexConfig = {
  client: 'mysql',
  connection: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
  },
  migrations: {
    directory: './migrations',
  },
  ...knexSnakeCaseMappers(),
};

export const knexInstance = Knex(knexConfig);
export default knexConfig;


