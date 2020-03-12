var express = require('express');
var router = express.Router();
var dbUser = require('../config/dbUser');
var path = require('path');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var userMiddleware = require('../middleware/userMiddleware');
var dbJob = require('../config/dbJob');

router.use(bodyParser.urlencoded({ extended: false }));

//sign-up
// router.post("/sign-up", function(req, res, next) {
//     let email = req.body.email;
//     let password = req.body.password;

//     dbUser.findOne({ email })
//         .then(function(checkEmail) {
//             if (checkEmail) {
//                 res.json('đã tồn tại tài khoản')
//             } else {
//                 bcrypt.hash(password, saltRounds, function(err, hash) {
//                     dbUser.create({
//                         email: email,
//                         password: hash
//                     }).then(function(data) {
//                         let token = jwt.sign({ email: email }, 'thanh', { expiresIn: '1h' })
//                             // console.log(token);
//                         var transporter = nodemailer.createTransport({
//                             service: 'gmail',
//                             auth: {
//                                 user: 'nqt130298@gmail.com',
//                                 pass: 'Ninhbinh123'
//                             }
//                         });
//                         var mailOptions = {
//                             from: 'nqt130298@gmail.com',
//                             to: `${email}`,
//                             subject: 'Chàng trai tháng 2',
//                             html: `<p> Link này tồn tại trong 1 giờ , xác thực
//                                  <a href="${req.protocol + '://' + req.get('host')}/api/authEmail/${token}"> Tại đây </a>`
//                         };
//                         transporter.sendMail(mailOptions, function(error, info) {
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 // console.log('thanh cong');
//                                 res.json('Đăng kí thành công vao mail xac nhan')
//                             }
//                         });
//                     })

//                 });
//             }

//         }).catch(function(err) {
//             console.log(err);
//         })


// })

//midd
router.post('/sign-up', userMiddleware.checkEmail, function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        dbUser.create({
            email: email,
            password: hash
        }).then(function(data) {
            let token = jwt.sign({ email: email }, 'thanh', { expiresIn: '1h' })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nqt130298@gmail.com',
                    pass: 'Ninhbinh123'
                }
            });
            var mailOptions = {
                from: 'nqt130298@gmail.com',
                to: `${email}`,
                subject: 'Chàng trai tháng 2',
                html: `<p> Link này tồn tại trong 1 giờ , xác thực
                             <a href="${req.protocol + '://' + req.get('host')}/api/authEmail/${token}"> Tại đây </a>`
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log('thanh cong');
                    return res.json('Đăng kí thành công vào mail xác nhận')
                }
            });
        })
    });
})

//api authEmail 
router.get("/authEmail/:token", function(req, res, next) {
    let token = req.params.token
    let decoded = jwt.verify(token, 'thanh');
    dbUser.updateOne({ email: decoded.email }, { status: "Active" })
        .then(function(data) {
            res.json('active thành công')
        })
})

//sign-in

// router.post("/sign-in", userMiddleware.checkAdmin, function(req, res, next) {
//     let email = req.body.email;
//     let password = req.body.password;
//     dbUser.find({ email: email })
//         .then(function(data) {
//             console.log(data);
//             if (data.length == 0) {
//                 res.json({
//                     error: true,
//                     messenger: "sai tk mk "
//                 })
//             }
//             if (data[0].status === "Active" && data[0].type === 1) {

//                 bcrypt.compare(password, data[0].password, function(err, value) {
//                     if (err) {
//                         res.json(err)
//                     }
//                     if (value) {
//                         let token = jwt.sign({ data: data[0]._id }, 'thanh', { expiresIn: '1d' });
//                         res.cookie("token", token)
//                         res.json({
//                             error: false,
//                             messenger: "đăng nhập thành công"
//                         })
//                     } else {
//                         res.json({
//                             error: true,
//                             messenger: "sai tài khoản hoặc mật khẩu "
//                         })
//                     }
//                 })
//             } else {
//                 res.json({
//                     error: true,
//                     messenger: "dn that bai"
//                 })
//             }
//         })
// })

router.post('/sign-in', function(req, res, next) {
        let email = req.body.email
        let password = req.body.password
        console.log('hihi');
        dbUser.find({ email: email })
            .then((data) => {
                if (data.length == 0) {
                    return res.json('Tài khoản sai')
                }
                bcrypt.compare(password, data[0].password, function(err, value) {
                    if (err) {
                        return res.json(err)

                    } else if (value) {
                        let token = jwt.sign({ data: data[0] }, 'thanh', { expiresIn: '1h' })
                        return res.json(token)
                    } else {
                        return res.json({
                            error: true,
                            messager: "sai mật khẩu"
                        })
                    }
                })
            })
    })
    //đếm db

router.post('/sign-in-admin', userMiddleware.checkAdmin, function(req, res, next) {

})

// phân trang
router.get('/pages/:page', function(req, res) {
    var page = parseInt(req.params.page)
    dbJob.find()
        .skip((page - 1) * 3)
        .limit(3)
        .exec()
        .then(function(data) {
            res.json(data)
        })
})

router.get('/count', function(req, res) {
    dbJob.estimatedDocumentCount()
        .then(function(data) {
            res.json(data)
        })
});

// Method Post btn-add
router.post('/add', (req, res) => {
    let title = req.body.nameJob;
    let content = req.body.leader;
    dbJob.create({
        title: title,
        content: content
    }).then(data => {
        console.log(data);
        res.json({
            status: 9999,
            messenger: "Thêm dữ liệu thành công",
            data: data

        })
    })
})


// Put btn-edit
router.put('/edit/:id', (req, res) => {
    let id = req.params.id;
    let title = req.body.editNameJob;
    let content = req.body.editNameLeader;
    dbJob.findByIdAndUpdate({ _id: id }, {
        $set: {
            title: title,
            content: content
        }
    }).then((value) => {
        dbJob.find({ _id: id })
            .then((data) => {
                res.json({
                    status: 9999,
                    messenger: "Edit thành công",
                    data: data
                })
            })
    })
})

// Delete btn-delete
router.delete('/delete/:id', (req, res) => {
    dbJob.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            res.json({
                status: 9999,
                messenger: "Delete thành công",
                data: data
            })
        })
})

// Details btn-details
router.get('/details/:id', (req, res) => {
    let id = req.params.id;
    let title = req.body.detailsNameJob;
    let content = req.body.detailsLeader;
    dbJob.findById({ _id: id, title: title, content: content })
        .then((data) => {
            res.json({
                status: 9999,
                messenger: "chi tiet",
                data: data
            })
        })
})






module.exports = router;