const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Hotel = new Schema({
    Hotel_Name: {
        type: String
    },
    Hotel_Address: {
        type: String
    },
    Website: {
        type: String
    },
    NO_Rooms: {
        type: String
    },
    Price_Max: {
        type: String
    },
    Price_Min:{
        type: String
    }
});

module.exports = mongoose.model('Hotel', Hotel);