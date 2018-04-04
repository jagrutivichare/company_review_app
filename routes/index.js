var mongodb = require('mongodb');
var companiesJson = {};

//home page
exports.home = function(req, res) {
	var MongoClient = mongodb.MongoClient;
	var url = process.env.MONGODB_URI;
	MongoClient.connect(url, function(err, database){
		if (err) {
			console.log("Unable to connect to database",err);
		} else {
			console.log("Connection established");
			companiesJson = database.db('companies');
			var collection = companiesJson.collection('companyList');
			collection.find({}).toArray(function(err, result) {
				if (err) {
					res.send(err);
				} else if (result.length) {
					res.render('home', {
						title : "Company Reviews",
						companies : result
					});
				}
			})
		}
	});

};

//about page
exports.about = function(req, res) {
	res.render('about', {
		title : "Company Reviews"
	});
}

//search companies
exports.search_company = function(req, res) {
	var search_val = req.body.search_value;
	var MongoClient = mongodb.MongoClient;
	var url = process.env.MONGODB_URI;
	MongoClient.connect(url, function(err, database){
		if (err) {
			console.log("Unable to connect to database",err);
		} else {
			console.log("Connection established");
			companiesJson = database.db('companies');
			var collection = companiesJson.collection('companyList');
			collection.find({ name: search_val }).toArray(function(err, result) {
				if (err) {
					res.send(err);
				} else {
					res.render('home', {
						title : "Company Reviews",
						companies : result
					});
				}
			})
		}
	});

}
//comapny reviews page
exports.company_single = function(req, res) {
	var id = req.params.id;
	var MongoClient = mongodb.MongoClient;
	var url = process.env.MONGODB_URI;
	MongoClient.connect(url, function(err, database){
		if (err) {
			console.log("Unable to connect to database",err);
		} else {
			console.log("Connection established");
			companiesJson = database.db('companies');
			var collection = companiesJson.collection('companyList');
			collection.find({}).toArray(function(err, result) {
				if (err) {
					res.send(err);
				} else if (result.length) {
					var company = result[id-1];
					res.render('company_single', {
						title : company.name,
						company : company
					});
				}
			})
		}
	});
};

//add company review page
exports.company_single_add_review = function(req, res) {
	var id = req.params.id;
	var collection = companiesJson.collection('companyList');
	collection.find({}).toArray(function(err, result) {
		if (err) {
			res.send(err);
		} else if (result.length) {
			var company = result[id-1];
			res.render('add_review', {
				title : company.name,
				company : company
			});
		}
	});
}

//post add company review request
exports.post_company_single_add_review = function(req, res) {
	var id = req.params.id;
	var name = req.body.labelForName;
	var position = req.body.labelForPosition;
	var ratings = req.body.select1;
	var review = req.body.companyReview;

	var MongoClient = mongodb.MongoClient;
	var url = process.env.MONGODB_URI;
	MongoClient.connect(url, function(err, database){
		if (err) {
			console.log("Unable to connect to database",err);
		} else {
			console.log("Connection established");
			companiesJson = database.db('companies');
			var collection = companiesJson.collection('companyList');

			collection.find({}).toArray(function(err, result) {
				if (err) {
					res.send(err);
				} else if (result.length) {
					var company = result[id-1];
					var _id = company._id;
					var avg_ratings = 0;
					if (company.ratings == 0) {
						avg_ratings = ratings;
					} else {
						avg_ratings = Math.round((parseInt(company.ratings) + parseInt(ratings))/2);
					}
					var reviewCount = company.total_reviews + 1;
					var reviewObj = {"name": name, "position": position, "ratings": ratings, "comment": review};
					collection.updateOne(
					   { _id: _id },
					   { $push: { reviews: reviewObj }, $set: {ratings: avg_ratings, total_reviews: reviewCount}}, 
					   function (err, result) {
					   		if (err) {
								res.send(err);
							} else {
								companiesJson = database.db('companies');
								var collection = companiesJson.collection('companyList');
								collection.find({}).toArray(function(err, result) {
									if (err) {
										res.send(err);
									} else if (result.length) {
										var company = result[id-1];
										res.render('company_single', {
											title : company.name,
											company : company
										});
									}
								})
							}
					   }
					);				
				}
			});
		}
	});
}

//not found page
exports.not_found = function(req, res) {
	res.send("Page not found");
};