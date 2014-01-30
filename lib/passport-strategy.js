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


    authStorage.getUser(username)

    //success
    .then(function(user) {
        

        if (user && user.password === password) {
            done(null, user);
        } else {
            return done(null, false, {
                message: "Incorrect user or password."
            });
        }


    })

    //failure
    .then(null, done);


}

module.exports = new LocalStrategy(validateUser);


module.exports.serialize = function(user, done) {
    done(null, user.username);
};

module.exports.deserialize = function(username, done) {
    
    authStorage.getUser(username)
        .then(function(user) {
            //success
            done(null, user);

        })
    //failure
    .then(null, done);


};

console.log("Authentication succesfully setup");
