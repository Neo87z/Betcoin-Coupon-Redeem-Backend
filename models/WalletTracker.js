const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Token = new Schema({
    OrderValue: {
        type: String
    },
    Code: {
        type: String
    },
    WalletAddress: {
        type: String
    },
    TokensToProvide: {
        type: String
    },

});

module.exports = mongoose.model('walletData', Token);