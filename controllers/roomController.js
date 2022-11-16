const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let Room = require('../models/room')
let User = require('../models/messageData')
let Bet = require('../models/betdata');
const { forEach } = require('underscore');
const puppeteer = require("puppeteer")
const sharp = require('sharp');
const Tesseract = require('tesseract.js')
const multer = require('multer');
var voucher_codes = require('voucher-code-generator');

let TokenData1 = require('../models/Tokens');
let TokenData2 = require('../models/BackupTokens');
let WalletTracker = require('../models/WalletTracker');
const DocDtaa = [
    {
        "doc_id": 1,
        "name": "Dr Neal G. Ranen York PA ",
        "scoliosis_type": "dextroscoliosis",
        "gender": "m",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Fabulous doctor! Dr. Ranen really takes his time and listens to your concerns. Kelly, the office manager, is wonderful also,very flexible in scheduling appointments and always friendly.'"
    },
    {
        "doc_id": 1,
        "name": "Dr Neal G. Ranen York PA ",
        "scoliosis_type": "dextroscoliosis",
        "gender": "m",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Wonderful doctor! Very punctual, but takes his time with you. He really listens to your concerns. Office staff is fabulous and will work with you to schedule appointments!'"
    },
    {
        "doc_id": 1,
        "name": "Dr Neal G. Ranen York PA ",
        "scoliosis_type": "dextroscoliosis",
        "gender": "m",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b\"Great caring Doctor always there for you.Won't give up on you.A very trustworthy Doctor.Kelly the office manager always glad to help me straighten out my self caused problems Highly recommend, Mark\""
    },
    {
        "doc_id": 2,
        "name": "Dr K. Todd Foreman Huntsville AL ",
        "scoliosis_type": "levoscoliosis",
        "gender": "m",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Dr. Foreman is great!!!! I believe he would be perfect if he replaces that Alabama lab coat with Auburn\\xf0\\x9f\\x98\\x82\\xf0\\x9f\\xa4\\xa3\\xf0\\x9f\\x98\\x82\\xf0\\x9f\\xa4\\xa3 (Joking sort of)I highly recommend this excellent surgican he knows his craft!!!'"
    },
    {
        "doc_id": 2,
        "name": "Dr K. Todd Foreman Huntsville AL ",
        "scoliosis_type": "levoscoliosis",
        "gender": "m",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Dr. Foreman I highly respect. He has done many of my surgies that were complications from having the Gastric Bypass and he is very knowledgeable about his specialty.'"
    },
    {
        "doc_id": 3,
        "name": "Dr Olasimbo M. Babatope Kennesaw GA ",
        "scoliosis_type": "kyphosis",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b\"I really enjoy my visits with Dr. Babatope she's very pleasant to talk with. I feel relaxed with her. I look forward to my appts. She is very nice & listen to you.\""
    },
    {
        "doc_id": 3,
        "name": "Dr Olasimbo M. Babatope Kennesaw GA ",
        "scoliosis_type": "kyphosis",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Made significant improvement since I started going to her for treatment Thanks\\nM. Frank'"
    },
    {
        "doc_id": 3,
        "name": "Dr Olasimbo M. Babatope Kennesaw GA ",
        "scoliosis_type": "kyphosis",
        "gender": "f",
        "S": 1,
        "P": 2,
        "H": 1,
        "K": 1,
        "review": "b'Dr. Babatope does not appear to have any interest in the patient other than giving one a prescription, getting you on your way and collecting a large fee for a two minute visit.'"
    },
    {
        "doc_id": 3,
        "name": "Dr Olasimbo M. Babatope Kennesaw GA ",
        "scoliosis_type": "kyphosis",
        "gender": "f",
        "S": 1,
        "P": 1,
        "H": 1,
        "K": 1,
        "review": "b\"This doctor will take your money and write you a script, but after that you're on your own. Avoid at all cost!!\""
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'I have been attending regular acupuncture sessions with Dr. Hagel for a number of months and have seen significant improvement in my energy level, sharper mental focus, overall sense of well-being and reduction in work related muscle tension. I have received acupuncture from a few different practitioners over the past 20 years and am very particular about who I see for my health. Dr. Hagel is fantastic at what she does. Pairing the acupuncture with her naturopathic practice works beautifully as she has a expansive breadth of knowledge and skills to support her clients in health and healing. She is one of the most compassionate and kind healthcare practitioners I know!\\n'"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'I highly recommend Docere Wellness especially Dr.Michelle Hagel. I was suffering from a dull ache/discomfort in my shoulder for more than 2 months. I am feeling alot better. You are always greeted with a smiling face and she genuinely cares about her clients.\\nShe is very professional, compassionate, knowledgeable and kind. I highly recommend this health clinic. She has made such a positive impact on my physical well being. Thank you.\\n'"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'I sought out the help of Dr. Michelle after hearing some bad news regarding my rising cholesterol levels. After reviewing my blood work results and discussing my lifestyle that led to my current results, Michelle came up with a plan that would help correct the numbers that were not favorable.\\nShe took into consideration, my goals and current work demands and came up with a plan that was not only easy to follow and stick with, it also had the positive effect of allowing me to rediscover my joy of cooking and reconnecting with the food. The recipes have been delicious.\\nI really appreciated her knowledge of the body and its systems, her patience in explaining how these systems are interconnected and rely on each other to function at their optimum and her encouragement while going through this process. Dr. Michelle made it very easy to not only experience some initial success, but also to incorporate this as my new way of living.\\nI could not recommend her strongly enough...\\nThank you very much Dr. Michelle'"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b\"I've been working with Michelle for quite some time. I can't say enough about her professionalism and ability to communicate with her patients. I would highly recommend her as a natural path to anybody who is seeking high-quality patient centred care.\""
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 4,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Dr. Hagel is a very attentive and considerate doctor. I had been to countless specialists for debilitating digestive issues. Once serious illnesses were ruled out the specialists lost interest in helping me--regardless of the disruption these issues were causing in my life. Dr. Hagel never lost interest in me as a patient, and her continued efforts helped me get my life back. She patiently listened to every detail and remembered everything I had said. I always felt heard, and I was never rushed in any of our appointments. She was always ready with additional recommendations if I found any treatments ineffective. She never left me feeling hopeless, as many of the doctors before her had. I am forever grateful for her help. '"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Dr Hagel is a very talented Doctor who has knowledge, experience, and extensive research to help her patients find what is wrong and how to fix it. I have been going to doctors for so many years with the same problems and nobody has helped me the way she did. She listens, gives her time, encourages email updates, asks questions, very kind and considerate of my feelings unlike other past doctors I have been to. She helped me find the root cause of my problem and assisted me to an effective plan that has removed everything I was going through for 14 years! She also has solutions to manage PTSD through accupuncture. '"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'I am so pleased with Dr. Hagal. After my sister had a visit with her and had success, I went to see her. So many things have turned around for me!!! She is a gentle person with a loving energy, that had me take action steps to better my health. I will continue seeing her and promoting natural health. Thank you Dr. Hagal! '"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Very personable and puts you at ease. Gets a broad understanding of issues and makes realistic and appropriate recommendations. I would highly recommend her!! '"
    },
    {
        "doc_id": 4,
        "name": "dr michelle hagel calgary ab ca",
        "scoliosis_type": "idiopathic",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Dr. Michelle is a kind, hard-working, and intelligent doctor. I am very happy to be working with her and plan to recommend her to my family and friends!'"
    },
    {
        "doc_id": 6,
        "name": "Dr Kendra Brough Cambridge ON ",
        "scoliosis_type": "juvenile",
        "gender": "f",
        "S": 5,
        "P": 5,
        "H": 5,
        "K": 5,
        "review": "b'Very approachable. Felt better after the first visit. Extremely helpful.\\n'"
    }
]

const treat =[
    {
        "LowerBound": 0,
        "UpperBound": 10,
        "Treatment": "Observation",
        "ImageUrl": "https://www.verywellhealth.com/thmb/oncFMv1SO2ffNipXRRUPA8HIt1E=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/scoliosis-lateral-curve-of-the-spine-2548780-color-V1-c044832970b94ee1ac37556aa3e3e8f9.png",
        "Description": "The advantage of watching and waiting is that many cases of scoliosis may not need treatment with a brace, or surgery. Many experts believe that mild cases of scoliosis do not have a large impact upon a person s health. But is this really true? Some scientists have found that, actually, mild cases of scoliosis can limit the body s ability to exercise effectively. Sometimes, too, even a small scoliosis can cause pain or other problems. Even if the scoliosis isn t getting worse, wouldn t it be nice to have an option that could help your loved one achieve their full athletic potential, or take away some of the pain or sleeplessness they may be experiencing as a result of their scoliosis? In most cases for young people with small curves, CLEAR Scoliosis Treatment does not require as large of a commitment as it does with more severe cases. Some people with small curves have achieved the results they wanted after only a few weeks of care. Also, CLEAR Certified Doctors of Chiropractic can teach your loved one some important exercises for their spine that may be helpful in the future."
    },
    {
        "LowerBound": 20,
        "Upper Bound": 30,
        "Treatment": "Bracing",
        "ImageUrl": "https://www.researchgate.net/profile/Julien-Clin/publication/49845335/figure/fig3/AS:442284383707137@1482460222683/Brace-design-factors-see-Table-1-for-details-A-B-Brace-type-C-Lordosis-design-D.png",
        "Description": "Wearing a brace is often the first step for kids who need treatment for idiopathic scoliosis. Doctors prescribe a brace hoping it will stop the curve from getting worse and help kids avoid spinal fusion surgery.For \nBraces don't work on every curve. Bracing won't help if a curve is too big (usually more than 40 degrees). And a brace may not be needed if a curve is too small"
    },
    {
        "LowerBound": 40,
        "UpperBound": 50,
        "Treatment": "Surgery",
        "ImageUrl": "https://jasonlowensteinmd.com/wp-content/uploads/2019/03/spinal-fusion-for-scoliosis.png",
        "Description": "If your curve is greater than 45 to 50 degrees, it will very likely get worse, even after you are fully grown. This may increase the cosmetic deformity in your back, as well as affect your lung function. Surgery is recommended."
    }
]

const prec = [
    {
        "name": "Looking down at your phone",
        "des": "When you bend your neck forward to stare down at your smartphone (adopting a posture sometimes known as ‘text neck’), the effect on your spine is as though your head were significantly heavier than it actually is.Of course, we’re all glued to our smartphones these days, but we’re not saying that you have to put your device down for good – just be aware of your posture when you’re using your phone, and try to avoid bending your neck forward if possible."
    }, {
        "name": "Lifting heavy objects",
        "des": "Lifting large weights puts pressure on your spine, and if it’s already curving to one side, the extra pressure can make that curvature even more pronounced. Scoliosis sufferers should endeavour to avoid lifting heavy objects alone. If you find yourself tasked with carrying a large weight, ask someone else to help you with it."
    }, {
        "name": "Certain exercises",
        "des": "Exercise is an important ally in the fight against scoliosis – indeed, our own ScoliGold treatment method is primarily exercise-based. However, certain exercises and stretches can do more harm than good when you’re coping with a curved spine."
    }, {
        "name": "High heels, flip-flops, and other shoes that don’t provide much support",
        "des": "When you’re purchasing footwear, it’s important to look for shoes that will give your body the support it needs. High-heeled shoes can put your spine under a lot of stress, but so can overly flat footwear such as flip-flops. Try to wear shoes with good arch support (orthotics/insoles can help with this). "
    }, {
        "name": "No Bending, Lifting, or Twisting",
        "des": "Even simple tasks often involve twisting the spine, but that motion will have to be restricted during recovery. For example, to avoid twisting (and bending) the spine while getting in and out of bed, the patient will need to use the “log roll” technique described on the previous page. "
    }, {
        "name": "Incision Site Care",
        "des": "It is important to maintain good care of the incision site. Every day, the patient will need to keep that area clean and dry. Typically, no creams, ointments, or powders are recommended. "
    }
]
module.exports = function () {
    
    
    router.get('/get_all_prec', function (req, res) {
        
        res.json({
                Data: prec,
              
            });

    })
    
    
    
    router.get('/get_all_treatment', function (req, res) {
         res.json({
                Data: treat,
              
            });
       
        
    })
    
    
    
    router.get('/get_all_doc', function (req, res) {
        
        res.json({
                Data: DocDtaa,
              
            });
       
    })


    
    router.post('/GenerateToken', function (req, res) {

        console.log(req.body);
        let InvoiceTotal = req.body.InvoiceTotal
        let BetcoinRewards = (InvoiceTotal / 50) * 15;

        let Token = voucher_codes.generate({
            prefix: "BetCoinMerch-",
            postfix: "-2022"
        });

        let TokenData = {
            "InvoiceTotal": InvoiceTotal,
            "Token": Token[0],
            "GivenBetcoinTokens": BetcoinRewards
        }

        console.log(TokenData);
        TokenData2
        let RoomData = new TokenData1(TokenData);
        RoomData.save()
            .then(Room => {
                var data = {
                    Status: "Sucess",
                    Message: "Token Sucessfully Generated",
                    Data: TokenData
                }
                res.status(201).send(data);
            }).catch(err => {
                console.log(err)
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            });

        

    })



    router.post('/ValidateToken', function (req, res) {
        TokenData1.find(function (err, data) {
            if (!err) {
                console.log((data.length))
                let size = data.length;
                let x = 0;
                let found = false;
                while (x < size) {
                    console.log(data[x]["InvoiceTotal"])
                    if (data[x]["Token"] == req.body.ValidateToken) {
                        console.log("pass");
                        found = true;

                    }
                    x++;
                }
                if (found == true) {
                    var data = {
                        Status: "Sucess",
                        Message: "Coupon Valid"
                    }
                    res.status(200).send(data);

                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Coupon Invalid"
                    }
                    res.status(200).send(data);

                }


            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            }
        })
    })

    router.post('/RegisterWallet', function (req, res) {
        TokenData1.find(function (err, data) {
            if (!err) {
                console.log((data.length))
                let size = data.length;
                let x = 0;
                let found = false;
                let pos = 0;
                while (x < size) {

                    if (data[x]["Token"] == req.body.ValidateToken) {
                        console.log("pass");
                        found = true;
                        pos = x;
                        break;

                    }
                    x++;
                }
                if (found == true) {

                    let LetWalletData = {
                        "OrderValue": data[pos]["InvoiceTotal"],
                        "Code": data[pos]["Token"],
                        "TokensToProvide": data[pos]["GivenBetcoinTokens"],
                        "WalletAddress": req.body.WalletAddress
                    }
                    console.log(LetWalletData)
                    let RoomData = new WalletTracker(LetWalletData);
                    RoomData.save()
                        .then(Room => {
                 
                            //res.status(201).send(data);
                            try {
                                console.log(pos)
                            
                            } catch {
                                var data = {
                                    Status: "Fail1",
                                    Message: "Unexpected Error PLease Contact System Admin"
                                }
                                res.status(200).send(data);

                            }
                        }).catch(err => {
                            console.log(err)
                            var data = {
                                Status: "Fail",
                                Message: "Unexpected Error PLease Contact System Admin"
                            }
                            res.status(200).send(data);
                        });
                        TokenData1.deleteOne({ Token: data[pos]["Token"] }, function (err, docs) {
                            if (!err) {
                                var data = {
                                    Status: "Coupon Redeemed",
                                    Message: "Coupon is no longer valid"
                                }
                                res.status(200).send(data);
                            } else {
                                var data = {
                                    Status: "Fail",
                                    Message: "Fail"
                                }
                                res.status(200).send(data);
                           
                            }
                        })





                   

                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Coupon Invalid"
                    }
                    res.status(200).send(data);

                }


            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            }
        })
    })



    router.post('/deleteBEt', function (req, res) {
        try {
            Bet.deleteOne({ _id: req.body.id }, function (err, docs) {
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

    router.get('/getBEts', function (req, res) {
        Bet.find(function (err, data) {
            if (!err) {
                console.l
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



    router.post('/addnewBet', function (req, res) {
        let RoomData = new Bet(req.body);
        var Bet1 = false;
        var Bet2 = false;
        var Bet3 = false;
        var Bet4 = false;
        Bet.find(function (err, data) {
            if (!err) {
                console.log((data[0]))

                data.forEach(element => {
                    if (element.BetID == '1') {
                        Bet1 = true;
                    }
                    if (element.BetID == '2') {
                        Bet2 = true;
                    }
                    if (element.BetID == '3') {
                        Bet3 = true;
                    }
                    if (element.BetID == '4') {
                        Bet4 = true;
                    }
                })

                if (Bet1 != true) {
                    RoomData.BetID = '1'
                    RoomData.save()
                        .then(Room => {
                            var data = {
                                Status: "Sucess",
                                Message: "Room Created Sucessfully"
                            }
                            res.status(201).send(data);
                        }).catch(err => {
                            var data = {
                                Status: "Fail",
                                Message: "Unexpected Error PLease Contact System Admin"
                            }
                            res.status(200).send(data);
                        });

                } else {
                    if (Bet2 != true) {
                        RoomData.BetID = '2'
                        RoomData.save()
                            .then(Room => {
                                var data = {
                                    Status: "Sucess",
                                    Message: "Room Created Sucessfully"
                                }
                                res.status(201).send(data);
                            }).catch(err => {
                                var data = {
                                    Status: "Fail",
                                    Message: "Unexpected Error PLease Contact System Admin"
                                }
                                res.status(200).send(data);
                            });
                    } else {
                        if (Bet3 != true) {
                            RoomData.BetID = '3'
                            RoomData.save()
                                .then(Room => {
                                    var data = {
                                        Status: "Sucess",
                                        Message: "Room Created Sucessfully"
                                    }
                                    res.status(201).send(data);
                                }).catch(err => {
                                    var data = {
                                        Status: "Fail",
                                        Message: "Unexpected Error PLease Contact System Admin"
                                    }
                                    res.status(200).send(data);
                                });

                        } else {
                            if (Bet4 != true) {
                                RoomData.BetID = '4'
                                RoomData.save()
                                    .then(Room => {
                                        var data = {
                                            Status: "Sucess",
                                            Message: "Room Created Sucessfully"
                                        }
                                        res.status(201).send(data);
                                    }).catch(err => {
                                        var data = {
                                            Status: "Fail",
                                            Message: "Unexpected Error PLease Contact System Admin"
                                        }
                                        res.status(200).send(data);
                                    });
                            } else {
                                res.status(200).send('Fail');
                            }
                        }
                    }
                }


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
    //Imalshi

    router.post('/getBetByID', function (req, res) {
        console.log(req.body)
        Bet.find(function (err, dataX) {

            if (!err) {
                console.log(dataX)
                var filtered = _.where(dataX, { BetID: req.body.id });

                dataX.forEach(element => {
                    if (element.BetID == req.body.id) {
                        res.status(200).send(element);
                    }
                })
                console.log("HU", filtered)
                var data = {
                    Status: "Sucess",
                    Message: "Retrived All Room Data",
                    data: filtered
                }

            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            }
        })
    })




    //Imlashi



    router.post('/updateBet', function (req, res) {
        console.log(req.body)
        try {
            Bet.updateOne({ _id: req.body.id }, {
                BetName: req.body.BetName, ImageURL: req.body.ImageURL, Team1: req.body.Team1, Team2: req.body.Team2, BetID: req.body.BetID, Team1Logo: req.body.Team1Logo, Team2Logo: req.body.Team2Logo, Team1Score: req.body.Team1Score, Team2Score: req.body.Team2Score
            }, function (err, docs) {
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


    async function UpdateScore(BetID, RealScore1, RealScore2) {


        Bet.find(function (err, dataX) {

            if (!err) {
                console.log(dataX)


                dataX.forEach(element => {
                    if (element.BetID == BetID) {
                        try {
                            Bet.updateOne({ BetID: BetID }, {
                                BetName: element.BetName, ImageURL: element.ImageURL, Team1: element.Team1, Team2: element.Team2, BetID: element.BetID, Team1Logo: element.Team1Logo, Team2Logo: element.Team2Logo, Team1Score: RealScore1, Team2Score: RealScore2
                            }, function (err, docs) {
                                if (!err) {
                                    var data = {
                                        Status: "Sucess",
                                        Message: "User Data Updated"
                                    }
                                    console.log('done')
                                    return


                                } else {
                                    var data = {
                                        Status: "Fail",
                                        Message: "Unexpected Error PLease Contact System Admin"
                                    }
                                    console.log('Fail')
                                    return

                                }
                            })
                        } catch {
                            var data = {
                                Status: "Fail",
                                Message: "Unexpected Error PLease Contact System Admin"
                            }
                            res.status(200).send(data);

                        }
                    }
                })


            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                res.status(200).send(data);
            }
        })



    }
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })

    const upload = multer({ storage: storage });

    router.post('/api/upload', upload.single('uploadedimage'), (req, res) => {
        console.log(req.file);
        try {
            Tesseract.recognize(
                'uploads/' + req.file.filename,
                'eng',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                return res.json({
                    message: text
                }

                )
            })


        } catch (error) {
            console.error(error)
        }
    })


    router.post('/deleteBEt', function (req, res) {
        try {
            Bet.deleteOne({ _id: req.body.id }, function (err, docs) {
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

    var Score1 = ""
    var Score2 = ""
    var Score3 = ""
    var Score4 = ""

    router.post('/GetEventScores', async function (req, res) {

        var Bet1 = false;
        var Bet2 = false;
        var Bet3 = false;
        var Bet4 = false;
        var Bet1Url = ""
        var Bet2Url = ""
        var Bet3Url = ""
        var Bet4Url = ""
        x = ""

        var BetScore1 = ""
        var BetScore2 = ""
        var BetScore3 = ""
        var BetScore4 = ""
        const ScoreData = []

        try {

            await Bet.find(function (err, data) {
                if (!err) {

                    data.forEach(element => {
                        if (element.BetID == '1' && element.Team2 == 'Active') {
                            Bet1 = true;
                            Bet1Url = element.Team2Logo
                            console.log(Bet1Url)
                        }
                        if (element.BetID == '2' && element.Team2 == 'Active') {
                            Bet2 = true;
                            Bet2Url = element.Team2Logo
                        }
                        if (element.BetID == '3' && element.Team2 == 'Active') {
                            Bet3 = true;
                            Bet3Url = element.Team2Logo
                        }
                        if (element.BetID == '4' && element.Team2 == 'Active') {
                            Bet4 = true;
                            Bet4Url = element.Team2Logo
                        }
                    })

                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Unexpected Error PLease Contact System Admin"
                    }
                    res.status(200).send(data);
                }
            })
            if (Bet1 == true) {
                await TakeScreenShot(Bet1Url)
                await CropImage(1)
                BetScore1 = await GetScore(1)
                try {
                    var Bet1Score = Score1.split('-')
                    var Bet1Team1Score = Bet1Score[0]
                    var Bet1Team1Score2 = Bet1Score[1]
                    Bet1Team1Score = Bet1Team1Score.replace(' ', '')
                    Bet1Team1Score = Bet1Team1Score.replace('\n', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace(' ', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace('\n', '')

                } catch (error) {
                    Bet1Team1Score = "-"
                    Bet1Team1Score2 = "-"

                }



                UpdateScore("1", Bet1Team1Score, Bet1Team1Score2)
            }
            if (Bet2 == true) {
                await TakeScreenShot(Bet2Url)
                await CropImage(2)
                await GetScore(2)
                try {

                    var Bet2Score = Score2.split('-')
                    var Bet1Team1Score = Bet2Score[0]
                    var Bet1Team1Score2 = Bet2Score[1]
                    Bet1Team1Score = Bet1Team1Score.replace(' ', '')
                    Bet1Team1Score = Bet1Team1Score.replace('\n', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace(' ', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace('\n', '')
                } catch (error) {
                    Bet1Team1Score = "-"
                    Bet1Team1Score2 = "-"

                }

                UpdateScore("2", Bet1Team1Score, Bet1Team1Score2)
            }
            if (Bet3 == true) {
                await TakeScreenShot(Bet3Url)
                await CropImage(3)
                await GetScore(3)
                try {
                    var Bet3Score = Score3.split('-')
                    var Bet1Team1Score = Bet3Score[0]
                    var Bet1Team1Score2 = Bet3Score[1]
                    Bet1Team1Score = Bet1Team1Score.replace(' ', '')
                    Bet1Team1Score = Bet1Team1Score.replace('\n', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace(' ', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace('\n', '')
                } catch {
                    Bet1Team1Score = "-"
                    Bet1Team1Score2 = "-"
                }
                UpdateScore("3", Bet1Team1Score, Bet1Team1Score2)
            }
            if (Bet4 == true) {
                await TakeScreenShot(Bet4Url)
                await CropImage(4)
                await GetScore(4)
                try {
                    var Bet4Score = Score4.split('-')
                    var Bet1Team1Score = Bet4Score[0]
                    var Bet1Team1Score2 = Bet4Score[1]
                    Bet1Team1Score = Bet1Team1Score.replace(' ', '')
                    Bet1Team1Score = Bet1Team1Score.replace('\n', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace(' ', '')
                    Bet1Team1Score2 = Bet1Team1Score2.replace('\n', '')

                } catch {
                    Bet1Team1Score = "-"
                    Bet1Team1Score2 = "-"
                }

                UpdateScore("4", Bet1Team1Score, Bet1Team1Score2)
            }



            res.status(200).send(data);
            console.log(Bet1Score, '1finally')
            console.log(Bet2Score, '2finally')
            console.log(Bet3Score, '3finally')
            console.log(Bet4Score, '4finally')




        } catch {

        }
        //res.status(200).send('data');

    })




    async function GetScore(betID) {
        try {
            await Tesseract.recognize(
                'images/croppedImage.jpg',
                'eng',
                { logger: m => console.log(m) }
            ).then((data) => {
                console.log(betID)
                Score = data.data.text
                if (betID == 1) {
                    Score1 = data.data.text

                } else {
                    if (betID == 2) {
                        Score2 = data.data.text
                    } else {
                        if (betID == 3) {
                            Score3 = data.data.text
                        } else {
                            if (betID == 4) {
                                Score4 = data.data.text
                            }
                        }
                    }
                }



            })

        } catch {
            console.log('fail')
        }

    }



    async function CropImage() {
        let originalImage = 'images/website.png';

        // file name for cropped image
        let outputImage = 'images/croppedImage.jpg';

        await sharp(originalImage).extract({ width: 270, height: 100, left: 225, top: 350 }).toFile(outputImage)
            .then(function (new_file_info) {
                console.log("Image cropped and saved");
            })
            .catch(function (err) {
                console.log(err);
            });

    }

    async function TakeScreenShot(URLDATA) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const options = {
            path: 'images/website.png',
            fullpage: true,
            omitBackground: true
        }
        await page.goto(URLDATA);
        await page.screenshot(options)
        await browser.close()
    }


    return router;
}
