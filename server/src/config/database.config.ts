import { Sequelize } from "sequelize";
import Env from './env.config'


const {DB_NAME,DB_USER,DB_HOST,DB_PORT,DB_PASS} = {...Env}
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`) 
export const connectDB=async()=>{
try {
  await sequelize.authenticate();
  console.log('Database Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}}
 
export default sequelize