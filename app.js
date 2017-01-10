var express = require('express')
var path = require('path')
var _  = require('underscore')
var bodyParser = require('body-parser')
//var cookieParser = require('cookie-parser')
var cookieSession = require('express-session')
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PORT || 3000
var app = express();

mongoose.connect('mongodb://localhost/movieApp')

app.locals.moment = require('moment')
app.set('views', './views')
app.set('view engine', 'jade')
app.use(bodyParser())
app.use(cookieSession({
	secret: 'movieApp',
  	resave: false,
  	saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('server started on port' + port)

app.post('/user/signup', function(req, res){
	var _user = req.body.user
	User.findOne({name:_user.name}, function(err, user ){
		if(err)
			console.log(err)
		if(user){
			console.log(user)
			return res.redirect('/')
		}
		else{
			var user = new User(_user)
			user.save(function(err, user){
			if(err)
				console.log(err)
			console.log(user)
			//return res.redirect('/admin/userlist')
			})
		}
	})
})

//signin
app.post('/user/signin', function(req, res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	User.findOne({name:name}, function(err, user){
		if(err)
			console.log(err)
		if(!user)
			return res.redirect('/')
		user.comparePassword(password, function(err, isMatch){
			if(err)
				console.log(err)
			if(isMatch){
				req.session.user = user
				return res.redirect('/')
			}
			else
				console.log('password is not matched')
		})
	})
})

app.get('/logout', function(req, res){

	delete req.session.user
	delete app.locals.user
	res.redirect('/')
})

app.get('/', function(req, res){
	var _user = req.session.user
	if(_user)
		app.locals.user = _user
	Movie.findMovies(function(err, movies){
		if(err)
			console.log(err)
		res.render('pages/index', {
			title: '首页',
			movies: movies
		})
	})
})



app.get('/movie/:id', function(req, res){
	var _user = req.session.user
	if(!_user)
		res.redirect('/')
	var id = req.params.id
	Movie.findMovie(id, function(err, movie){
		if(err)
			console.log(err)
		res.render('pages/detail', {
			title: '详情页' ,
			movie: movie
		})
	})
})

app.get('/admin/movie', function(req, res){
	res.render('pages/admin', {
		title: '后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language:''
		}
	})
})

app.get('/admin/update/:id', function(req, res){
	var id = req.params.id
	if(id){
		Movie.findMovie(id, function(err, movie){
			res.render('pages/admin', {
				title: '后台更新页面',
				movie: movie
			})
		})
	}

})

app.post('/admin/movie/new', function(req, res){
	console.log(req.body.movie)
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if (id != 'undefined') {
		Movie.findMovie(id, function(err, movie){
			if(err)
				console.log(err)
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err)
					console.log(err)
				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
		})
		_movie.save(function(err, movie){
			if(err)
				console.log(err)
			res.redirect('/movie/' + movie._id)
		})
	}
})

app.get('/admin/userlist', function(req, res){
	User.findUsers(function(err, users){
		if(err)
			console.log(err)
		res.render('pages/userlist', {
			title: '用户列表页',
			users: users
		})
	})
})

app.get('/admin/list', function(req, res){
	Movie.findMovies(function(err, movies){
		if(err)
			console.log(err)
		res.render('pages/list', {
			title: '列表页',
			movies: movies
		})
	})
})

app.delete('/admin/list', function(req, res){
	var id = req.query.id
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err)
				console.log(err)
			else{
				res.json({"success": "1"})
			}
		})
	}
})