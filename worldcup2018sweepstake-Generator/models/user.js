var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Passport
var UserSchema = new mongoose.Schema({username: String, password: String});
UserSchema.plugin(passportLocalMongoose);

// Export
module.export = mongoose.model('User', UserSchema);