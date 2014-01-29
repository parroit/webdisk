"use strict";

var expect = require("expect.js"),
    AuthStorage = require("../lib/auth-storage");


describe("AuthStorage", function() {
    var authStorage;

    before(function(done) {
        authStorage = new AuthStorage({
            file: "test/user-storage/users.json",
            onReady: done
        });
    });

    it("is defined", function() {
        expect(AuthStorage).to.be.an("function");
    });

    it("is instantiable", function() {
        expect(authStorage).to.be.an("object");
    });

    it("read config files at start", function(done) {
        authStorage.getUser("ola").then(function(usr) {
            expect(usr).to.be.an("object");
            expect(usr.fullname).to.be.equal("parroit");
            done();
        })



    });

    function itInvokeStorageSave(action) {
        describe("cause storageSaved event to be emitted", function() {
            before(function(done) {
                var count = 0;

                function checkStorageSaved() {

                    done();
                    authStorage.events.removeListener("storageSaved", checkStorageSaved);
                }

                function waitStorageClean() {
                    if (!authStorage.dirty) {

                        authStorage.events.on("storageSaved", checkStorageSaved);

                        action();

                    } else {

                        setTimeout(waitStorageClean, 10);
                    }

                }

                waitStorageClean();

            });

            it("set dirty to false", function() {
                expect(authStorage.dirty).to.be.equal(false);
            });
        });
    }



    describe("saveUser", function() {
        var user,
            dirtyAtStart;

        before(function(done) {
            dirtyAtStart = authStorage.dirty;
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

        it("dirty false at start", function() {
            expect(dirtyAtStart).to.be.equal(false);
        });

        it("set storage to dirty", function() {
            expect(authStorage.dirty).to.be.equal(true);
        });


        itInvokeStorageSave(function() {
            authStorage.saveUser({
                username: "parroit2",
                password: "piripicchio",
                fullname: "Andrea Parodi",
                email: "andrea.parodi@ebansoftware.net",
                status: "pending"
            });
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

        itInvokeStorageSave(function() {
            authStorage.removeUser("parroit2");
        });
    });
});