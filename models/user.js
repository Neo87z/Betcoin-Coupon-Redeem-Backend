const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
    Full_Name: {
        type: String
    },
    Email: {
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

module.exports = mongoose.model('User', User);