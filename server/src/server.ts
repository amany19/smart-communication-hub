import app from "./app"
import dotenv from 'dotenv'
import { connectDB } from "./config/database.config";
dotenv.config()
const PORT = process.env.PORT || 5050;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})()