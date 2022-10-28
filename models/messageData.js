const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Names = new Schema({
    MessageID: {
        type: String
    },
    Sender: {
        type: String
    },
    Message: {
        type: String
    },
});

module.exports = mongoose.model('Names', Names);