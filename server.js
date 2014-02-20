'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://localhost/angular-lei');
var BeerSchema = new Schema({
  title: String,
  brand: String,
  image: String,
  size: Number,
  price: Number
}, { collection: 'beers' });
var Beers = mongoose.model('Beer', BeerSchema);

var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use("/", express.static(path.join(__dirname, 'app')));
  app.use(app.router);
});

app.get('/api/beers', function(req, res) {
  Beers.find().exec().then(function(beers) {
    return res.send(beers);
  });
});

app.get('/api/beers/:id', function(req, res) {
  Beers.findById(req.params.id).exec().then(function(beer) {
    return res.send(beer);
  });
});

app.get('*', function(req, res) {
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

exports = module.exports = app;
