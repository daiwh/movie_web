var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	year: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

MovieSchema.pre('save', function(next){
	if(this.isNew)
		this.meta.createAt = this.meta.updateAt = Date.now()
	else
		this.meta.updateAt = Date.now()

	next()
})

MovieSchema.statics.findMovie = function(id, result){
	this.find({_id: id}, result)
}

MovieSchema.statics.findMovies = function(result){
	this.find({}, result)
}
/*
MovieSchema.statics = {
	fetch: function(cb){
		console.log('findall')
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	fetch: function(id,cb){
		return this.findOne({_id: id}).exec(cb)
	}
}
*/
module.exports = MovieSchema