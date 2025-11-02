import dotenv from 'dotenv';
dotenv.config();

const Env = {
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASS: process.env.DB_PASS!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_LIFE : process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  PEPPER:process.env.PEPPER,
  SALT:parseInt(process.env.SALT||'12'),

};

export default Env;
