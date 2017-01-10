var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
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

UserSchema.pre('save', function(next){
	var user = this
	if(this.isNew)
		this.meta.createAt = this.meta.updateAt = Date.now()
	else
		this.meta.updateAt = Date.now()
	var hash = bcrypt.hashSync(this.password);
	user.password = hash

	/*bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){//加盐
		if(err)
			return next(err)
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err)
				return next(err)
			user.password = hash
			next()
		})
	})*/
	next()
})

UserSchema.methods = {
	comparePassword: function (_password, cb) {
    var hash = this.password;
    var isMatch = bcrypt.compareSync(_password, hash);
      cb(null, isMatch);
    }
}

UserSchema.statics.findUser = function(name, result){
	// console.log('数据库查找' + id)
	this.find({name: name}, result)
}

UserSchema.statics.findUsers = function(result){
	// console.log('数据库查找')
	this.find({}, result)
}

module.exports = UserSchema