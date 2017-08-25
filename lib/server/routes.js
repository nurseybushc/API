const jwt = require("jsonwebtoken");

const Modlist = require("./models/modlist");
const { tokenEnsureAuthorized } = require("./routes/utils");

const user = require("./routes/user");
const users = require("./routes/users");
const upload = require("./routes/upload");
const script = require("./routes/script");
const search = require("./routes/search");
const auth = require("./routes/auth");
const oauth = require("./routes/oauth");

module.exports = routes;

function routes(app, { jwtSecret, env }) {

	user(app);
	users(app);
	auth(app, {
		jwtSecret
	});
	oauth(app, {
		jwtSecret,
		env
	});
	upload(app);
	script(app);
	search(app);

	app.get("/health", (req, res) => {
		res.sendStatus(200);
	});

  app.post("/api/newTag/:username", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, jwtSecret, (err, decoded) => {
			if(err) {
				res.sendStatus(403);
				return;
			}
			Modlist.findOne({username: req.params.username})
			.then(modlist => {
				if(modlist) {
					modlist.tag = req.body.tag;
					return modlist.save()
					.then(() => {
						res.sendStatus(200);
					});
				} else {
					res.sendStatus(404);
				}
			})
			.catch(e => {
				res.sendStatus(500);
			});
		});
	});
	app.post("/api/newENB/:username", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, jwtSecret, (err, decoded) => {
			if(err) {
				res.sendStatus(403);
				return;
			}
			Modlist.findOne({username: req.params.username})
			.then(modlist => {
				if(modlist) {
					modlist.enb = req.body.enb;
					return modlist.save()
					.then(() => {
						res.sendStatus(200);
					});
				} else {
					res.sendStatus(404);
				}
			})
			.catch(e => {
				res.sendStatus(500);
			});
		});
	});
}