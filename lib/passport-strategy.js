var LocalStrategy = require("passport-local").Strategy,
    AuthStorage = require("../lib/auth-storage"),
    config = require("./app-configure").config,
    authReady = false,

    authStorage = new AuthStorage({
        file: config.auth.usersFile,
        onReady: function() {
            authReady = true;
        }
    });

function validateUser(username, password, done) {
    if (!authReady) {
        return done(null, false, {
            message: "authstorage not ready. retry later."
        });
    }

    if (username != "parroit" || password != "porta111") {
        return done(null, false, {
            message: "Incorrect user or password."
        });
    }
    return done(null, { username:"parroit", fullname:"Andrea Parodi"});

    /*User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: "Incorrect username."
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: "Incorrect password."
            });
        }
        return done(null, user);
    });*/
}

module.exports = new LocalStrategy(validateUser);


module.exports.serialize = function(user, done) {
    done(null, user.username);
};

module.exports.deserialize = function(username, done) {
    done(null,{ username:"parroit", fullname:"Andrea Parodi",password:"porta111"});
    return;
    authStorage.getUser(username)
        .then(function(user) {
            //success
            done(null, user);

        })
        //failure
        .then(null, done);


};

console.log("Authentication succesfully setup");