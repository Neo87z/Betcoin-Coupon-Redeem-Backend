const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let bet = new Schema({
    BetName: {
        type: String
    },
    ImageURL: {
        type: String
    },
    Team1: {
        type: String
    },
    Team2: {
        type: String
    },
    BetID: {
        type: String
    },
    Team1Logo: {
        type: String
    },
    Team2Logo: {
        type: String
    },
    
    Team1Score: {
        type: String
    },
    Team2Score: {
        type: String
    },
    

});

module.exports = mongoose.model('bets', bet);