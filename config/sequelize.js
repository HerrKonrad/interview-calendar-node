const Sequelize = require('sequelize');
require('dotenv').config();

const config = {
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_DATABASE,
    host: process.env.DB_PROD_HOST,
    dialect: process.env.DB_PROD_DIALECT,
    port: process.env.DB_PROD_PORT,
  },
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    dialect: process.env.DB_DEV_DIALECT,
    port: process.env.DB_DEV_PORT,
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    dialect: process.env.DB_TEST_DIALECT,
    port: process.env.DB_TEST_PORT,
  },
};

// Use a variável de ambiente NODE_ENV para selecionar a configuração correta
const environment = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(
  config[environment].database,
  config[environment].username,
  config[environment].password,
  {
    dialect: config[environment].dialect,
    host: config[environment].host,
    port: config[environment].port,
  }
);

(async () => {
    // Sincronizará apenas num ambiente de produção ou caso seja forçado pela variável de ambiente FORCE_SYNC
  if(process.env.FORCE_SYNC == 1)
  {
    await sequelize.sync({ alter: true, drop: false });
    console.log('Modelos sincronizados com sucesso!');
  }
  
  })();
  
  
  module.exports = sequelize;