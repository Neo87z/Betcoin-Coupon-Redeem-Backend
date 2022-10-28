const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Token = new Schema({
    Token: {
        type: String
    },
    InvoiceTotal: {
        type: String
    },
    GivenBetcoinTokens: {
        type: String
    }
});

module.exports = mongoose.model('token', Token);