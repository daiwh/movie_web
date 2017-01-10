var mongoose = require('mongoose')

var MoviesSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
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

MoviesSchema.pre('save', function(next){
	if(this.isNew)
		this.meta.createAt = this.meta.updateAt = Date.now()
	else
		this.meta.updateAt = Date.now()

	next()
})

MoviesSchema.statics.findMovie = function(id, result){
	// console.log('数据库查找' + id)
	this.findOne({_id: id}, result)
}

MoviesSchema.statics.findMovies = function(result){
	// console.log('数据库查找')
	this.find({}, result)
}
/*
MoviesSchema.statics = {
	fetch: function(cb){
		console.log('findall')
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	fetch: function(id,cb){
		return this.findOne({_id: id}).exec(cb)
	}
}
*/
module.exports = MoviesSchema