const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Room = new Schema({
    Room_Name: {
        type: String
    },
    Room_Type: {
        type: String
    },
    Beds: {
        type: String
    },
    Floor: {
        type: String
    },
    Price: {
        type: String
    }
});

module.exports = mongoose.model('Room', Room);