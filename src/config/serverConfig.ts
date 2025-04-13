// This file contains the server configuration settings.

import dotenv from 'dotenv';
dotenv.config();
export const serverConfig = {
    serverPort: process.env.SERVER_PORT || 5000
}