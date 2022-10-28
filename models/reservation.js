const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Reservation = new Schema({
    User_Name: {
        type: String
    },
    Room_ID: {
        type: String
    },
    From_Date: {
        type: String
    },
    To_Date: {
        type: String
    },
    Price: {
        type: String
    },
    Status:{
        type: String
    }
});

module.exports = mongoose.model('reservation', Reservation);