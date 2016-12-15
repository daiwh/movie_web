var express = require('express')
var path = require('path')
var _  = require('underscore')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Movie = require('./models/Movie')
var port = process.env.PORT || 3000
var app = express();

mongoose.connect('mongodb://localhost/movieApp')

app.locals.moment = require('moment')
app.set('views', './views')
app.set('view engine', 'jade')
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('server started on port' + port)

app.get('/', function(req, res){
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
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id != undefined) {
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