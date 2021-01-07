var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
   image_url: String,
   name:String,
}, {timestamps: true});

module.exports =mongoose.model('ImageUpload', UserSchema);
