
export  const dbConfig = {
    dbName: process.env.DB_NAME || 'brainly',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 27017,
    dbConnection: null
}
// This file contains the database configuration settings.