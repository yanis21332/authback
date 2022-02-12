const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");

const stuffRoutes = require("./routes/user")
//connect to mongodb

let server = http.createServer(app)

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

app.use("/",stuffRoutes)
//luanching server
server.listen(4000, err => {
    if (!err) {
        console.log(`lancement du serveur sur le port 4000`)
    } else {
        console.error(`erreur lors du lancement du serveur : ${err}`)
    }
})