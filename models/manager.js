const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Manager = new Schema({
    Manager_Name: {
        type: String
    },
    LoginID: {
        type: String
    },
    Password: {
        type: String
    },
    Age: {
        type: String
    },
    Phone: {
        type: String
    },
    Sex:{
        type:String
    }
});

module.exports = mongoose.model('manager', Manager);