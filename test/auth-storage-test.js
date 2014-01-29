"use strict";

var expect = require("expect.js"),
    AuthStorage = require("../lib/auth-storage"),
    authStorage = new AuthStorage();


describe("AuthStorage", function() {

    it("is defined", function() {
        expect(AuthStorage).to.be.an("function");
    });

    it("is instantiable", function() {
        expect(authStorage).to.be.an("object");
    });

    describe("saveUser", function() {
        var user;

        before(function(done) {
            authStorage.saveUser({
                username: "parroit",
                password: "piripicchio",
                fullname: "Andrea Parodi",
                email: "andrea.parodi@ebansoftware.net",
                status: "pending"
            })
                .then(function(results) {
                    getParroit(function(usr) {
                        user = usr;
                        done();
                    });

                })

            .then(null, function(err) {
                console.log(err.stack);
            });
        });

        it("user object is stored", function() {
            expect(user).to.be.an("object");
        });
    });

    function getParroit(cb) {
        authStorage.getUser("parroit")

        .then(function(usr) {
            cb(usr);
        })

        .then(null, function(err) {
            console.log(err.stack);
        });
    }

    describe("getUser", function() {
        var user;

        before(function(done) {

            getParroit(function(usr) {
                user = usr;
                done();
            });

        });

        it("user is object", function() {
            expect(user).to.be.an("object");
        });

        it("user has email", function() {
            expect(user.email).to.be.equal("andrea.parodi@ebansoftware.net");
        });

        it("user has username", function() {
            expect(user.username).to.be.equal("parroit");
        });

        it("user has fullname", function() {
            expect(user.fullname).to.be.equal("Andrea Parodi");
        });

        it("user has status", function() {
            expect(user.status).to.be.equal("pending");
        });

        it("user has password hash", function() {
            expect(user.password).to.be.a("string");
        });
    });



    describe("removeUser", function() {
        var user;

        before(function(done) {
            authStorage.removeUser("parroit")
                .then(function(results) {
                    getParroit(function(usr) {
                        user = usr;
                        done();
                    });

                })

            .then(null, function(err) {
                console.log(err.stack);
            });
        });

        it("user object is removed", function() {
            expect(user).to.be.equal(null);
        });
    });
});