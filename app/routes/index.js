var request = require("request");
var PintUser = require("../models/PintUser.js");
var Image = require("../models/Image.js");
var path = process.cwd();

module.exports = function(app, passport) {
    app.route(["/", "/recent", "/mywall"])
        .get(function(req, res) {
            res.sendFile(path + '/client/index.html');
        });

    app.route("/api/images")
        .get(function(req, res) {
            Image.find({}, function(err, images) {
                if (err) { throw err; }
                var imageArray = [];
                var i = images.length - 30;
                if (i < 0) {
                    i = 0;
                }
                for (i; i < images.length; i++) {
                    imageArray.push(images[i]);
                }
                res.json(imageArray);
            });
        });

    app.route('/api/user')
		.get(function (req, res) {
			if (req.user) {
				res.json(req.user);
			}
            else {
                res.json("no user");
            }
		});

    app.route("/api/add/image")
        .post(function (req, res) {
            var image = req.body.image;
            var user = req.body.user;
            request(image.URL, function (error, response) {
                if (error ) {
                    res.json("bad image");
                }
                else {
                    if (response.statuscode === 404) {
                        image.URL = "http://strategyjournal.ru/wp-content/themes/strategy/img/default-image.jpg";
                    }
                    var images = user.images;
                    images.push(image);
                    var conditions = { "twitter.id": user.twitter.id }
                        , update = {$set: { images: images }}
                        , options = { multi: false };
                    PintUser.update(conditions, update, options, function(err) {
                        if (err) { throw err; }
                        var newImage = new Image();
                        newImage.title = image.title;
                        newImage.owner = image.owner;
                        newImage.URL = image.URL;
                        newImage.save(function(err) {
                            if (err) { throw err; }
                            user.images = images;
                            res.json(user);
                        });
                    });
                }
            });
        });

    app.route("/api/delete/image")
        .post(function (req, res) {
            var image = req.body.image;
            var user = req.body.user;
            var images = user.images;
            var index = -1;
            for(var i = 0; i < images.length; i++) {
                if (images[i].title === image.title
                        && images[i].URL === image.URL
                            && images[i].owner === image.owner) {
                    index = i;
                    break;
                }
            }
            images.splice(index, 1);
            var conditions = { "twitter.id": user.twitter.id }
                , update = {$set: { images: images }}
                , options = { multi: false };
            PintUser.update(conditions, update, options, function(err) {
                if (err) { throw err; }
                Image.findOneAndRemove({title: image.title, URL: image.URL, owner: image.owner}, function(err, data) {
                    if (err) { throw err; }
                    console.log(data);
                    user.images = images;
                    res.json(user);
                });
            });
        });

    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/');
        });

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/recent'
        }));
}
