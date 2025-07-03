const dotenv=require("dotenv").config()
const express= require("express")
const app=express()
const connectDb =require("./config/connectionDb")
const cors=require("cors")
const path = require('path');


const PORT=process.env.PORT || 3000
connectDb()


app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/",require("./routes/user"))
app.use("/description",require("./routes/description"))
app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})