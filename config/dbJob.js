var mongoose = require('./dbConfig');
var Schema = mongoose.Schema;

var listJob = new Schema({
    title: String,
    content: String
}, {
    collection: "Job"
})


var jobModel = mongoose.model('job', listJob)


// jobModel.create({
//     title: 'abc',
//     content: 'aaa'
// })


module.exports = jobModel;