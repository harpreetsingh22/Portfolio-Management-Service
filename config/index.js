
import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

export const email = {
    sendGridApiKey: process.env.SEND_GRID_KEY,
    from: process.env.SENDGRID_FROM_EMAIL,
};

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION
}

export const port = process.env.PORT;