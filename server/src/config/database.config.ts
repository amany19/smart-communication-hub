import { Sequelize } from "sequelize";
import Env from './env.config'


const {DB_NAME,DB_USER,DB_HOST,DB_PORT,DB_PASS} = {...Env}
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,{logging:false}) 
// For neon database
// const sequelize = new Sequelize(`postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?sslmode=require&channel_binding=require`,{logging:false}) 
export const connectDB=async()=>{
try {
  await sequelize.authenticate();
  // await sequelize.sync({ alter: true });
  console.log('Database Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}}
 
export default sequelize