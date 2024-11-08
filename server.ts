import app from "./app"
import dotenv from "dotenv";

dotenv.config();

(async()=>{
    app.listen(process.env.APP_PORT, ()=>{
        console.log(`Running on http://localhost:${process.env.APP_PORT}`)
    })
})()