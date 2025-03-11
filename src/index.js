import app from './app.js';
import dotenv from 'dotenv';
import dbConnect from './db/index.js';
dotenv.config({
   path: "./.env",
 });

dbConnect()
.then(() => {
   app.listen(process.env.PORT,()=>{
      console.log(`SERVER IS RUNNING ON ${process.env.PORT}`);
   })
}).catch(error => {
    console.log(error);
})
