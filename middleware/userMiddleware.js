var jwt = require('jsonwebtoken');
var dbUser = require('../config/dbUser');
var bcrypt = require('bcryptjs');


var checkEmail = function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    dbUser.find({ email: email })
        .then(function(data) {
            if (data.length == 0) {
                next()
            } else {
                return res.json('tài khoản đã tồn tại')
            }
        })
}


// var checkAdmin = function(req, res, next) {
//     let email = req.body.email;
//     let password = req.body.password;
//     dbUser.find({ email: email })
//         .then(function(data) {
//             console.log(data);
//             if (data.length === 0) {
//                 res.json({
//                     error: true,
//                     messenger: "sai tk mk admin "
//                 })
//             }
//             if (data[0].type === 1) {
//                 bcrypt.compare(password, data[0].password, function(err, value) {
//                     if (err) {
//                         res.json(err)
//                     }

//                     if (value) {
//                         let token = jwt.sign({ data: data[0]._id }, 'thanh', { expiresIn: '1d' });
//                         res.cookie("token", token)
//                         res.json({
//                             error: false,
//                             messenger: "Đăng nhập quyền Admin thành công"
//                         })
//                     } else {
//                         // res.json('sai mk')
//                         res.json({
//                             err: false,
//                             messenger: "Sai mật khẩu"
//                         })
//                     }
//                 })
//             }
//             if (data[0].type === 2) {
//                 res.json({
//                     type: true,
//                     messenger: "Đăng nhập quyền ADMIN that bai"
//                 })
//             }
//         })
// }


function checkAdmin(req, res, next) {
    let token = req.cookies.token
    try {
        if (token) {
            var jwtDecoded = jwt.verify(token, 'thanh');
            console.log(jwtDecoded);
            if (jwtDecoded.data.type === 1) {
                next()
            } else {
                // res.json('ko phair admin')
                res.redirect('user')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        if (error.message === 'jwt malformed') {
            return res.json({
                status: 401,
                err: "ban nhap sai mat khau hoac tai khoảnaaa"
            })
        }
    }
}

function checkXacThuc(req, res, next) {
    let token = req.cookies.token
    try {
        if (token) {
            var jwtDecoded = jwt.verify(token, 'thanh');
            if (jwtDecoded.data.status === "Active") {
                next()
            } else {
                res.json('chưa xác thực')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        if (error.message === 'jwt malformed') {
            return res.json({
                status: 401,
                err: "bạn chưa xác thưucj"
            })
        }
    }
}
module.exports = { checkEmail, checkAdmin, checkXacThuc }