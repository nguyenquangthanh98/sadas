var mongoose = require('./dbConfig');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    type: {
        type: Number,
        default: 2
    },
    status: {
        type: String,
        default: 'null'
    }
}, {
    collection: "user"
});
var userModel = mongoose.model('user', userSchema);

//tao moi 1 data
// userModel.create({
//     email: "nguyenquangthanh.sl98@gmail.com",
//     password: "123456"
// })

module.exports = userModel;