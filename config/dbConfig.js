var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project2_TO_DO_LIST', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
module.exports = mongoose;