var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var convoSchema = new Schema({
	userId:{
		type: Number,
		required: true
	},
	email:{
		type: String,
		required: true	
	},
	dateTime: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model('Convo',convoSchema);
