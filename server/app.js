import express from 'express';
import dotenv from "dotenv";
import router from './router.js';
import connect from './connect.js';
import cors from 'cors';
dotenv.config();


const app=express();

app.use(cors())
app.use(express.json())
app.use("/api",router)

connect().then(()=>{
    try{
        app.listen( process.env.port,()=>{
            console.log('connected to the port');
        })
    }catch{
        console.log('cannot connect to the server')
    }
}).catch(err=>{
    console.log('invalid connection')
})



