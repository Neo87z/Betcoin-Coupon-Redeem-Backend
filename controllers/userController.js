const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let User = require('../models/messageData')
const saltRounds = 10;
module.exports = function () {

    //Imalshi

    router.post('/get_all_messages', function (req, res) {
        console.log(req.body)
        User.find(function (err, data) {
            if (!err) {
      
                    res.status(200).send(data);
             
            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            }
        })
    })

    

    //Imalshi

    router.post('/updateUser', function (req, res) {
        try {
            User.updateOne({ Email: req.body.Email }, { Full_Name: req.body.Full_Name, Age: req.body.Age, Phone: req.body.Phone, Sex: req.body.sex }, function (err, docs) {
                if (!err) {
                    var data = {
                        Status: "Sucess",
                        Message: "User Data Updated"
                    }
                    res.status(200).send(data);
                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Unexpected Error PLease Contact System Admin"
                    }
                    res.status(200).send(data);
                }
            })
        } catch {
            var data = {
                Status: "Fail",
                Message: "Unexpected Error PLease Contact System Admin"
            }
            res.status(200).send(data);

        }
    })


  
    return router;
}