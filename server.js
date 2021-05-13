const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const stuffRoutes = require("./routes/user")
//connect to mongodb

mongoose.connect("mongodb+srv://YanisKerrouche:Yanis.com123@cluster0.ag5tc.mongodb.net/authApp",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("connecté a mongodb");
    
}).catch(err=>{
    console.log("NON connecté a mongodb, erreur : "+err);
})
//routes
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use("/api/auth",stuffRoutes)
app.get("/",(req,res)=>{
    res.send("tu es dans le bon url")
})

//luanching server
app.listen(4000)
console.log("lancement du serveur")