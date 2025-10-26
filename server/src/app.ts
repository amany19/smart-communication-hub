import express from 'express'
import cors from 'cors'
import {json} from 'body-parser'
import dotenv from 'dotenv'

dotenv.config();
const app = express()
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(json())
app.get('/',()=>{console.log("Already running")})
export default app