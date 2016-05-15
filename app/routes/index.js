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
                var imageArray;
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
            console.log(req.user);
			if (req.user) {
				res.json(req.user);
			}
            else {
                res.json("no user");
            }
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
