const { Pool } = require("pg")
// Coloca aquí tus credenciales

const dbConnect = async () => {
  try {
    const connectionData = {
      user: process.env.USER_DB,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD_DB,
      port: process.env.PORT,
      ssl: {
        rejectUnauthorized: false
      }
    }
    // const client = new Client(connectionData)
    // return client

    const pool = new Pool(connectionData)
    
    // Test the connection
    await pool.query('SELECT NOW()');

    console.log('PostgreSQL connected successfully');
    return pool
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    return null;
  }
  
}

module.exports = { dbConnect };