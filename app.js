var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var mongo = require('mongodb');
var routes = require('./routes');

var bodyParser = require("body-parser");

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//home page
app.get('/', routes.home);

//about page
app.get('/about', routes.about);

//comapny reviews page
app.get('/company_reviews/:id?', routes.company_single);

//add company review page
app.get('/company_reviews/:id?/add-review', routes.company_single_add_review);

//post add company review request 
app.post('/company_reviews/:id?/add-review', routes.post_company_single_add_review);

//search company request 
app.post('/search', routes.search_company);

//not found page
app.get('*', routes.not_found);

app.listen(process.env.PORT || 3000);