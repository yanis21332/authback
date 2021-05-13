const express = require("express");
const mongoose = require("mongoose");

let ShemaAccount = mongoose.Schema({
    email : {required:true,type:String},
    password: {required:true,type:String},
    bio: {required:false,type:String},
    name: {required:false,type:String},
    phone: {required:false,type:String},
    media: {required:false}
})

module.exports = mongoose.model("ShemaAccount",ShemaAccount);